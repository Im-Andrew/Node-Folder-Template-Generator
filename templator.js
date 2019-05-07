const path = require('path');
const fs = require('fs');

// Utilities
const Util = {

    TEMP_IGNORE: ".temp",

    findTemplatePath(location, templateName) {
        return fs.readdirSync(location).reduce((found, element) => {
            if (found.length !== 0) return found; // escape if found
            const fullPath = path.join(location, element);

            // Check if correct template file
            if (element.startsWith(templateName)
                && fs.lstatSync( fullPath ).isDirectory() ) {
                return fullPath; // found the correct template
            }

            return found;
        }, "");
    },

    // adapted from https://stackoverflow.com/a/52338335/2945133
    copyFolderSync(from, to) {
        if (fs.existsSync(to)) { return false; }
        fs.mkdirSync(to);
        fs.readdirSync(from).forEach(element => {
            if (fs.lstatSync(path.join(from, element)).isFile()) {
                fs.copyFileSync(path.join(from, element), path.join(to, element));
            } else {
                copyFolderSync(path.join(from, element), path.join(to, element));
            }
        });
        return true;
    },

    // Renames all files with a pattern to the desired name, including content
    renameAllSync(location, nameMapper) {
        fs.readdirSync(location).forEach(element => {
            const target = path.join(location, element);
            const targetNew = nameMapper(target).replace(this.TEMP_IGNORE, "");
            fs.renameSync(target, targetNew);
            if (fs.lstatSync(targetNew).isDirectory()) {
                renameAllSync(targetNew, nameMapper);
            } else {
                Util.renameContentSync(targetNew, nameMapper);
            }
        });
    },

    // Replaces all content in a file with the desired content
    renameContentSync(file, dataMapper) {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) { return console.log(err); }

            const result = dataMapper(data);

            fs.writeFile(file, result, 'utf8', (err) => {
                if (err) { return console.log(err); }
            });
        });
    }
};


// Tag Parsing Utility
/* Tag Capturing And Output Algorithm:

    1: Find split indexes that match the pattern: `{tag-name....}` 
        - case sensitive component name
        - captures anything between the name and closing bracket
    2: Capture the template tags which splitted the data
    3: Parse each individual captured template tag
    4: Join both arrays back where they seperated
*/

/* Tag Filter Parsing Algorithm

    1: Replace any tag ending with '?' with itself minus the last ? ( escape unwanted change )
    2: Replace tag directly if there's certainly no filter
        - check if length = to tag {tag-name}.length
    3: Capture filter function by selecting everything after tag-name and before closing bracket `}`
    4: Replace tag with applied filter if exists, otherwise throw error and exit
*/

/*
* A collection of filter functions to be applied on a tag.
*/
const filters = {
    delimiter: '-',
    TITLE(str) {
        return str.split(this.delimiter).map(str => {
            return str.charAt(0).toLocaleUpperCase() + str.slice(1).toLocaleLowerCase();
        }).join(' ');
    },
    PASCAL(str) {
        return this.TITLE(str).replace(/ /g, "");
    },
    CAMEL(str) {
        return str.charAt(0).toLocaleLowerCase() + this.PASCAL(str).slice(1);
    },
    /**
     * CAMPAS is an optional name-case where the first letter can be upper or lower and left untouched.
     * @param {string} str value to correct case
     */
    CAMPAS(str) {
        return str.charAt(0) + this.PASCAL(str).slice(1);
    }
};

/**
 * mapTags will take any string of data and return a template applied string. 
 * @param {string} data Any string to have its tags mapped and parsed
 * @param {string} tagName The tag to be looked for when parsing
 * @param {string} userVal The value to replace the tag with
 * @param {object} filters An object containing functions used to filter the user value.
 * @returns {string}
 */
function mapTags(data, tagName, userVal, filters) {
    const captureReg = RegExp(`{${tagName}[^.}]*}`, 'g');
    const nonTagData = data.split(captureReg);

    // Parsed
    const tags = [
        // match returns null if no results found, so fallback to || []
        ...( (data.match(captureReg) || []).map(
            v => parseTag(v, tagName, userVal, filters)
        )),
        // match length of nonTagData
        ''
    ];

    return nonTagData.reduce((acc, cur, i) => acc + cur + tags[i], "");
};

/**
 * Will return a replaced-filtered tag.
 * @param {string} tag Complete tag found when mapping. Expected to be of format `{tagName filter}`
 * @param {string} tagName The tag looked for when parsing
 * @param {string} userVal The value to replacce the tag
 * @param {object} filters An object containing functions used to filter user values.
 */
function parseTag(tag, tagName, userVal, filters) {
    //case: not a template tag
    if (tag.endsWith('?}')) return tag.slice(0, tag.length - 2) + '}';

    //case: # no filter
    if (tag.length === tagName.length + 2) { return userVal; }

    //case: apply a possible filter
    // get filter
    const filter = tag.slice(tagName.length + 1, tag.length - 1).trim();
    if (filters.hasOwnProperty(filter)) {
        return filters[filter](userVal);
    } else {
        console.error(`No such filter \`${filter}\`[${filter.length}C] for tag \`${tag}\`.`);
    }
};


function parseTemplateCommands(args, workingDirectory, scriptDirectory) {
    // Components
    // arguments:   < template name: string > < output folder: string > [< component name: string >...]

    // Fail if not enough arguments.
    if (args.length < 4) {
        console.log("Not enough arguments -", `[${args.length}] provided, need [4] or more.`);
        process.exit(1);
    }

    const templateDirectory = path.join( scriptDirectory, '/templates/');

    const template = args[2];
    const outputPath = path.join(workingDirectory, args[3]);
    const components = args.slice(4, args.length);

    // find component
    const templatePath = Util.findTemplatePath( templateDirectory, `{${template} `);
    const templateExists = fs.existsSync(templatePath);

    if (templateExists) {

        // Generate all templates into the output directory
        components.forEach(name => {
            const output = mapTags(
                path.join(outputPath, path.basename(templatePath) ),
                template, name, filters
            );
            if (Util.copyFolderSync(templatePath, output)) {
                Util.renameAllSync(output, data=> mapTags( data, template, name, filters ) );
            }
        });

    } else {
        console.error(`Template "${template}" does not exist.`);
    }
};



/// --------------------------------------------- EXECUTE ----------------------------------------------- //
// Parse commands for templates. 
parseTemplateCommands(process.argv, process.cwd(), __dirname);
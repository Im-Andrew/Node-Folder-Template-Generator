# Templator

A small Node.js tool which will take a folder structure you design,
based on some formatting rules, and enable you to generate 
different versions of that folder structure with the names replaced
against the defined filters.

# Test it right now!
It takes only three steps to watch templator work. Simply do the steps below and copy-paste the commands.

1. Make a folder and clone from inside it: `git clone https://github.com/Im-Andrew/Node-Folder-Template-Generator.git .`
2. Generate templates in the root instantly: `node templator.js component-full / my-component Big-component such-template`

You should see 3 folders pop up in the root of your project after running the command; folders `myComponent`, `BigComponent`, and `suchTemplate`.

# How to use

## Setup
1. Place the `templator.js` file inside a folder in your project.
2. Create a folder called `templates`
3. Each folder inside of `templates` represents a template

## Running Templator
Provide templator a minimum of 3 arguments.
1. Argument 1: template name
2. Argument 2: output folder path (relative to the current working directory)
3. Argument 3: a list of strings delimited by spaces.
    i. The strings in Argument 3 will be effected by the pipes by how they seperate words using a hyphen.
    ii. The pattern after each hyphen will be treated as another word in the passed string.

__Note: The following example uses one of the existing templates.__

example command: `node tools/templator.js component-full src/components/ Big-image Small-image Countdown-timer`

## The output  
This will generate 3 folders inside of components named `BigImage`, `SmallImage`, and `CountdownTimer` where each
folder contains similarly structured files but the contents have been inlined with the passed items.


# Template Documentation

## Available text transformations (Text Pipes)

| Case Names   | CODE   | Description                                                                                |
|--------------|--------|--------------------------------------------------------------------------------------------|
| Title Case   | TITLE  | First letter of all words are capitalized.                                                 |
| Pascal Case  | PASCAL | Words are effected under pascal case.                                                      |
| Camel Case   | CAMEL  | Words are effected under camel case.                                                       |
| Camel Pascal | CAMPAS | This acts like camel case, but the first letter of the first word you pass is not changed. |

## How to use a template Pipe

The format is as follows:
1. Wrap the component name inside of brackets `{component}`
2. Give the component a pipe by adding it to the end of the container `{component PIPE}`
    i. _Note:_ It is important that there is a space between the component name and the pipe.
3. You're done.


**How to escape:** If you don't want something between brackets to be treated as a pipe, just 
place a quotation mark at the end like so: `{dont pipe?}`. It will be then left as `{dont pipe}`.

## Making your template folder structure

1. Take a common folder pattern you use
2. Replace the name found throughout the folder structure with the corresponding pipe.
    i. For example: Campas for file names, Camel for (most languages) Class names
3. You can replace the repeating name with a pipe such as a file name, or anywhere in a textfile
4. Place this template folder in the `templates` directory, and now you can generate templates with it by its name

_note: see existing template for examples._

**The fake .tmp extension:** Sometimes the tools you're using look where they shouldn't and there's no way
to avoid that with the tech you're using itself. I've provided a way to stop those tools from scanning these improper
files by hiding them using a fake extension in your template directory using `.tmp`. Feel free
to use this when needed.

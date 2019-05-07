import React from 'react';
import {{component PASCAL}} from './{component CAMPAS}';
import renderer from 'react-test-renderer';

// See: https://jestjs.io/docs/en/tutorial-react
// - Snapshots are expected to be updated with commits
// - If the differences between snapshots are expected run jest -u

test('{component TITLE} changes class when hovered', () => {
    const component = renderer.create(
        <{component PASCAL} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    /* Examples
    // manually trigger the callback
    tree.props.onMouseEnter();
    // re-rendering
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // manually trigger the callback
    tree.props.onMouseLeave();
    // re-rendering
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    */
});
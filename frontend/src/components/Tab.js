// Author: Joshua Barbee
// 
// This is taken directly from my submission for Quiz 2.

/*
    This component simply encloses any provided children and makes the intent
    of TabPanel's children clearer. The component should have the following
    props:
        title
            The title to display in the tab's associated button. This is used
            only in TabPanel.
        (optional) desc
            The header text within the tab. No header is displayed if desc is
            not specified.
        (optional) active
            Indicates this tab should be shown first. If an earlier tab defines
            this prop, the prop is ignored for this tab.

    The content will be wrapped in a single div, but the props of the div can
    only be determined within TabPanel (since access to the collection of Tabs
    in the panel is required to determine whether to include the classes "show"
    and "active"). Thus, the div that supporst the tab behavior is generated
    with a mapping in TabPanel.wrapTabs().
*/
const Tab = ({ desc, children }) =>
    <div className="card text-white bg-secondary mb-3">
        {desc !== undefined ? <div className="card-header">{desc}</div> : ""}
        <div className="card-body">
            {children}
        </div>
    </div>;

export default Tab;

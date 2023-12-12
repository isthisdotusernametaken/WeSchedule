// Author: Joshua Barbee
// 
// This is taken directly from my submission for Quiz 2.

import { Children } from "react";

/*
    Tabs with title props should be provided as children.

    The intent of this component's structure is to avoid redundancy in client
    code and handle all aspects of generating the buttons and tab content with
    minimal involvement from code using this component. This required some
    departures from typical React coding practices.

    To this end, tab's id values do not need to be specified by the code using
    this component and are instead programatically generated. This avoids
    programmer error because id values are automatically unique as long as
    panelId is unique.

    panelId is required and must be unique among TabPanel instances.
*/
const TabPanel = ({ panelId, children }) => {
    // Handle potential child counts of 0 and 1. This allows Array methods to
    // be used later.
    // Filtering non-component children allows conditional rendering in TabPanel.
    const tabs = (Array.isArray(children) ? children :
                 children === undefined ? [] :
                 Array(children)).filter(comp => comp.props != null);

    const startTab = findActive(tabs);

    return (
        <div className="container-fluid mt-3">
            {/* Clickable bar displaying the choices of tabs */}
            <ul className="nav nav-tabs" role="tablist">
                {createTabButtons(tabs, startTab, panelId)}
            </ul>
            <hr className="my-2" />

            {/*
                Include all provided tabs within the panel body.
                Only one will be shown at a time.
            */}
            <div className="tab-content">
                {wrapTabs(tabs, startTab, panelId)}
            </div>
        </div>
    );
}

// Determine which tab to select and display initially.
//
// This finds the first tab with a defined "active" prop or, if no tab has a
// defined active prop, the first tab. The active prop may be empty (e.g.,
// <Tab title="A Title" active></Tab>), as it will then evaluate to true and
// thus be defined.
function findActive(tabs) {
    const startTab = tabs.findIndex(tab => tab.props.active !== undefined);
    return startTab === -1 ? 0 : startTab;
}

const tabIdOf = (panelId, index) => `${panelId}-tab-${index}`;

const tabButtonIdOf = (tabId) => `${tabId}-button`;

/*
    For each provided Tab component, add a new button to the tab bar.
    The id of the new button is the Tab's id with "-tab" appended.

    The title values are extracted from the props of the children.
    This is not common in React code, but it avoids redundantly including the
    id values in the TabPanel's props and keeps each Tab's id and title
    visually close to their Tab, improving readability.

    The first tab with a defined active value is initially selected.
*/
const createTabButtons = (tabs, startTab, panelId) => tabs.map(
    ({ props: { title } }, i) => {
        let tabId = tabIdOf(panelId, i);

        return (
            <li className="nav-item" role="presentation" key={i}>
                <button className={`nav-link${i === startTab ? " active" : ""}`} id={tabButtonIdOf(tabId)}
                        data-bs-toggle="tab" data-bs-target={`#${tabId}`} role="tab" type="button"
                        aria-controls={tabId} aria-selected={i === startTab}>
                    {title}
                </button>
            </li>
        );
    }
);

/*
    Each child of the TabPanel is wrapped in a div that includes the properties
    necessary to define a tab.
    This is needed because which tab will be shown must be coordinated among
    the children. See the comment in src/components/Tab.js.
    
    Including this behavior within TabPanel also technically enables components
    other than Tab to be safely used in a TabPanel, but using Tab components is
    suggested (1) for clarity of purpose in client code, (2) for consistent tab
    styling, and (3) to allow child components to reuse the prop names title
    and active with different values if they choose (i.e., these props are
    attached to the containing Tab, so the component representing the actual
    tab content is not affected by the TabPanel).
*/
const wrapTabs = (tabs, startTab, panelId) => Children.map(
    tabs, (tab, i) => {
        let tabId = tabIdOf(panelId, i);

        return (
            <div className={`tab-pane fade${i === startTab ? " show active" : ""}`}
                 id={tabId} role="tabpanel" aria-labelledby={tabButtonIdOf(tabId)}>
                {tab}
            </div>
        );
    }
);

export default TabPanel;

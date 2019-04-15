import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import SearchPage from "./SearchPage";

Enzyme.configure({ adapter: new Adapter() });

/*
1. When user clicks search button without entering a text query,
   it should display error;
2. When a user clicks the search button with text query entered,
   it should return results;
3. Run search if the URL contains "q" query string

*/

describe("<SearchPage />", () => {
  const onSubmit = jest.fn();
  const rootComponent = shallow(<SearchPage onSubmit={onSubmit} />);
  const form = rootComponent.find(".form-search");

  it("form submitted without search text should return error", () => {
    form.simulate("submit", { preventDefault () {} });
    expect(rootComponent.state().error).toEqual('Text is mandatory!');
    expect(onSubmit.mock.calls.length).toBe(0);
  });

  it("form submitted with search text should return results", () => {
    const input = form.find("#q");
    rootComponent.setState({ error: null, q: 'javascript' });
    form.simulate("submit", { preventDefault () {} });
      console.log(3, rootComponent.state());
      expect(onSubmit.mock.calls.length).toBe(0);
    // expect([1, 2, 3]).toHaveLength(3);
    //expect(searchform.find('.search-results')).to.have.lengthOf(1);
  });
});

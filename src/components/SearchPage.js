import React, { PureComponent } from "react";
import Select from "react-select";
import { parseQueryStr, buildQuery, isEmpty } from "../utils";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from "reactstrap";
import logo from "../logo.png";

const BASE_URL = "https://api.github.com/search/repositories";

const licenses = [
  { value: "mit", label: "MIT" },
  { value: "isc", label: "ISC" },
  { value: "apache-2.0", label: "Apache" },
  { value: "gpl", label: "GPL" }
];

class SearchPage extends PureComponent {
  state = {
    q: "",
    stars: "",
    license: "",
    fork: false,
    error: null,
    items: null,
    loading: false
  };

  async componentDidMount() {
    if (this.props.location) {
      const values = parseQueryStr(this.props.location.search);
      if (isEmpty(values)) {
        return;
      }
      const { q, stars, license, fork } = values;
      const url = buildQuery({ q, stars, license, fork });
      const res = await this.fetchData(url);
      if (res.status === 200) {
        const { items } = await res.json();
        this.setState({ items });
      }
    }
  }

  handleSubmit = async e => {
    e.preventDefault();
    const { q, stars, license, fork } = this.state;

    if (q === "") {
      this.setState({ error: "Text is mandatory!" });
      return;
    }
    this.setState({ loading: true });
    try {
      const url = buildQuery({ q, stars, license, fork });
      const res = await this.fetchData(url);
      if (res.status === 200) {
        const { items } = await res.json();
        this.setState({ items, loading: false, error: "" });
        this.props.history.push(`/search?${url}`);
      }
    } catch (error) {
      console.log("error", error); // this can be handled differently and presented to user.
    }
  };

  handleChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  handleLicenseChange = ({ value }) => {
    this.setState({ license: value });
  };

  fetchData = async url => {
    try {
      const res = await fetch(`${BASE_URL}?${url}`);
      return res;
    } catch (error) {
      return { serverErr: error };
    }
  };

  render() {
    return (
      <>
        <header style={{ background: "black", height: 30 }} />
        <div
          style={{
            background: "#66a9f4",
            height: 30,
            paddingLeft: 50
          }}
        >
          <img src={logo} height="20" alt="even financial" />
        </div>
        <Container>
          <div className="wrapper">
            <h3 style={{ padding: "10px 0" }}>
              Even Financial Github Respository Search
            </h3>
            <Form onSubmit={this.handleSubmit} className="form-search">
              <Row form>
                <Col md={6}>
                  <Label for="text">Text</Label>
                  <FormGroup>
                    {this.state.error && (
                      <small className="text-danger">
                        {this.state.error}
                      </small>
                    )}

                    <Input
                      type="text"
                      name="q"
                      id="q"
                      value={this.state.q}
                      onChange={this.handleChange}
                      disabled={!!this.state.loading}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <Label for="star">Star</Label>
                  <FormGroup>
                    <Input
                      type="text"
                      name="stars"
                      id="star"
                      value={this.state.stars}
                      onChange={this.handleChange}
                      disabled={!!this.state.loading}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={6}>
                  <Label for="text">License</Label>
                  <FormGroup style={{ width: 300 }}>
                    <Select
                      options={licenses}
                      onChange={this.handleLicenseChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={6} style={{ position: "relative", top: 35 }}>
                  <FormGroup check>
                    <Label>
                      <Input
                        type="checkbox"
                        name="fork"
                        checked={this.state.fork}
                        onChange={this.handleChange}
                      />{" "}
                      Include forked
                    </Label>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col style={{ textAlign: "center" }}>
                  <Button
                    className="search-btn"
                    disabled={!!this.state.loading}
                    type="submit"
                  >
                    Search
                  </Button>{" "}
                  {this.state.loading && (
                    <span className="text-danger">Searching...</span>
                  )}
                </Col>
              </Row>
            </Form>
            <hr />
            {!this.state.items && (
              <p style={{ textAlign: "center", fontSize: 12 }}>
                Please enter search and click SEARCH button above, results
                appear here.
              </p>
            )}

            {this.state.items && (
              <div className="search-results">
                <h3 className="title">SEARCH results</h3>
                {this.state.items[0] ? (
                  this.state.items.map((item, k) => (
                    <Row className={`item child-${k}`} key={item.id}>
                      <Col md={6} className="border no-border-top">
                        <a href={item.html_url}>{item.full_name}</a>
                        <p>{item.description}</p>
                        <p>
                          Owner: <strong>{item.owner.login}</strong>
                        </p>
                        {item.fork && (
                          <Button className="forked">Forked</Button>
                        )}
                      </Col>
                      <Col
                        md={3}
                        className="border no-border-left no-border-top"
                      >
                        <span>Stars:</span>
                        <p>
                          <strong>{item.stargazers_count}</strong>
                        </p>
                      </Col>
                      <Col
                        md={3}
                        className="border no-border-left no-border-top"
                      >
                        <span>License:</span>
                        <p>
                          <strong>
                            {item.license && item.license.spdx_id}
                          </strong>
                        </p>
                      </Col>
                    </Row>
                  ))
                ) : (
                  <p style={{ textAlign: "center", fontSize: 12 }}>
                    No results for that search
                  </p>
                )}
              </div>
            )}
          </div>
        </Container>
      </>
    );
  }
}

export default SearchPage;

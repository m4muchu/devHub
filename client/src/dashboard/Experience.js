import React, { Component } from "react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { deleteExperience } from "../actions/profileActions";

class Experience extends Component {
  onClick(id) {
    this.props.deleteExperience(id);
  }
  render() {
    const experience = this.props.experience.map(exp => (
      <tr key={exp._id}>
        <td>{exp.company}</td>
        <td>{exp.title}</td>
        <td>
          {exp.from} - {exp.to === "" ? "Now" : exp.to}
        </td>
        <td>
          <button
            onClick={this.onClick.bind(this, exp._id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    ));
    return (
      <div>
        <h4 className="mb-4">Experience Credentials</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Title</th>
              <th>Years</th>
              <th />
            </tr>
            {experience}
          </thead>
        </table>
      </div>
    );
  }
}

Experience.propTypes = {
  deleteExperience: Proptypes.func.isRequired
};

export default connect(
  null,
  { deleteExperience }
)(Experience);

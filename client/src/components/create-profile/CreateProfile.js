import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
import InputGroup from "../common/InputGroup";
import TextAreaField from "../common/TextAreaField";
import SelectListGroup from "../common/SelectListGroup";

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySocialInput: false,
      handle: "",
      company: "",
      website: "",
      location: "",
      status: "",
      skills: "",
      gitHubUserName: "",
      bio: "",
      twitter: "",
      facebook: "",
      linkedin: "",
      instagram: "",
      youtube: "",
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    console.log("submit");
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors, displaySocialInput } = this.state;

    let socialInputs;

    if (displaySocialInput) {
      socialInputs = (
        <div>
          <InputGroup
            placeholder="twitter Profile URL"
            name="twitter"
            icon="fab fa-twitter"
            value={this.state.twitter}
            onChange={this.onChange}
            error={errors.twitter}
          />
          <InputGroup
            placeholder="Facebook Profile URL"
            name="facebook"
            icon="fab fa-facebook"
            value={this.state.facebook}
            onChange={this.onChange}
            error={errors.facebook}
          />
          <InputGroup
            placeholder="Linkedin Profile URL"
            name="linkedin"
            icon="fab fa-linkedin"
            value={this.state.linkedin}
            onChange={this.onChange}
            error={errors.linkedin}
          />

          <InputGroup
            placeholder="Youtube Profile URL"
            name="youtube"
            icon="fab fa-youtube"
            value={this.state.youtube}
            onChange={this.onChange}
            error={errors.youtube}
          />
          <InputGroup
            placeholder="Instagram Profile URL"
            name="instagram"
            icon="fab fa-instagram"
            value={this.state.instagram}
            onChange={this.onChange}
            error={errors.instagram}
          />
        </div>
      );
    }
    // select options for status

    const options = [
      { label: "* select Professional status", value: 0 },
      { label: "Developer", value: "Developer" },
      { label: "Junior Developer", value: "junior Developer" },
      { label: "Senior Developer", value: "Senior Developer" },
      { label: "Student or Learning", value: "Student or Learning" },
      { label: "Instructor or Teacher", value: "Instructor or Teacher" },
      { label: "Intern", value: "Intern" },
      { label: "Other", value: "Other" }
    ];

    return (
      <div className="create-profile">
        <div className="container">
          <div className="col-md-8 m-auto">
            <div className="display-4 text-center">Create Your Profile</div>
            <p className="lead text-center">
              Let's get some information to make your profile stand out
            </p>
            <small className="d-block pb-3">* = required field</small>
            <form onSubmit={this.onSubmit}>
              <TextFieldGroup
                placeholder="* Profile Handle"
                name="handle"
                value={this.state.handle}
                onChange={this.onChange}
                error={errors.handle}
                info="A unique handle for profile URL.Your full name,company name,nick name"
              />
              <SelectListGroup
                name="status"
                value={this.state.status}
                options={options}
                onChange={this.onChange}
                error={errors.status}
                info="Give us an idea about where you are in your career "
              />
              <TextFieldGroup
                placeholder="Company Name"
                name="company"
                value={this.state.company}
                onChange={this.onChange}
                error={errors.company}
                info="Could be you own company or one you work for"
              />
              <TextFieldGroup
                placeholder="Website"
                name="website"
                value={this.state.website}
                onChange={this.onChange}
                error={errors.website}
                info="Could be you own website or company one"
              />

              <TextFieldGroup
                placeholder="Location"
                name="location"
                value={this.state.location}
                onChange={this.onChange}
                error={errors.location}
                info="Could be you own website or company one"
              />

              <TextFieldGroup
                placeholder="Skills"
                name="skills"
                value={this.state.skills}
                onChange={this.onChange}
                error={errors.skills}
                info="Please use comma seprated values (eg.HTML,javascript,react,react-native,PHP"
              />

              <TextFieldGroup
                placeholder="Github Username"
                name="github Username"
                value={this.state.gitHubUserName}
                onChange={this.onChange}
                error={errors.gitHubUserName}
                info="If you want your latest repos and a Github link,include your username"
              />
              <TextAreaField
                placeholder="Short Bio"
                name="bio"
                value={this.state.bio}
                onChange={this.onChange}
                error={errors.bio}
                info="Could be you own website or company one"
              />

              <div className="mb-3">
                <button
                  onClick={() => {
                    this.setState(prevState => ({
                      displaySocialInput: !prevState.displaySocialInput // chect it in react of browser
                    }));
                  }}
                >
                  Add Social Network Links
                </button>
                <span className="text-muted">Optional</span>
              </div>
              {socialInputs}
              <input
                type="submit"
                value="submit"
                className="btn btn-info btn-block mt-4"
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(mapStateToProps)(CreateProfile);

var React = require("react");
var Button = require("react-bootstrap/lib/Button");
var Modal = require("react-bootstrap/lib/Modal");
var Input = require("react-bootstrap/lib/Input");
var ButtonInput = require("react-bootstrap/lib/ButtonInput");
var $ = require("jquery");

var ModalButtonMixin = {
  close: function (){
    this.setState({ showModal: false});
  },
  open: function(){
    this.setState({ showModal: true ,
        uploadStatus: "initial"});
  },
  getInitialState: function () {
    return { showModal: false,
                disabled: false,
                uploadStatus: "initial"
                };
  }
};

var CommentModal = React.createClass({
  mixins: [ModalButtonMixin],
  handleComment: function(editor){
    var comment_edit = this.refs.commentBox;
    var comment = comment_edit.getValue();
    editor.replaceSelection("<!--" + comment + "-->");
    this.setState({
      showModal: false
    });
  },
  handleSubmit: function () {
    var f = this.handleComment;
    this.props.onEvent(f);
  },
  render: function() {
    return (
                <Button bsSize= "xs" ref="comment" onClick={this.open}>
                <i className="fa fa-commenting"></i>
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add A Comment</Modal.Title>
                    </ Modal.Header>
                    <Modal.Body >
                        <Input ref="commentBox" type="text" label="Comment" placeholder="Enter comment" />
                        <ButtonInput value="Make Comment" onClick={this.handleSubmit}/>
                    </ Modal.Body>
                </ Modal>
                </Button>
        );
  }
});

var ImageUploadModal = React.createClass({
  mixins: [ModalButtonMixin],
  uploadImage: function() {
    var file = this.refs.fileInput.getInputDOMNode().files[0];
    var fD = new FormData();
    fD.append("file", file);
    this.setState({disabled: true, uploadStatus: "uploading"});
    $.ajax({
      type: "POST",
      url: "/upload_image",
      data: fD,
      processData: false,
      contentType: false,
      success: function(res) {
        this.setState({urlValue: res.url,
                    uploadStatus: "success"});
        this.close();
      }.bind(this),
      error: function(res){
        this.setState({urlValue: "",
                    uploadStatus: "error"});
      }.bind(this)
    }).done(function(res){
      this.setState({disabled: false});
    }.bind(this));
  },

  render: function (){
    return (<Button bsSize="xs" ref="imageUpload" onClick={this.open}>
                    <i className="fa fa-file-image-o"></i>
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload Image</Modal.Title>
                    </ Modal.Header>
                    <Modal.Body >
                        <Input type="text" ref="urlInput"placeholder="Enter Image Url" />
                        <Input type="file" ref="fileInput" label="Image File" />
                        <UploadButton ref="uploadBtn" uploadStatus={this.state.uploadStatus} handleSubmit={this.uploadImage}/>
                    </ Modal.Body>
                    <Modal.Footer />
                </ Modal>
                </Button>);
  }
});

// upload button with progress indication
var UploadButton = React.createClass({
  getInitialState: function () {
    return {
      status: "initial",
      disabled: false
    };
  },
  renderFa: function (status) {
    var fi;
    switch (status) {
    case "initial":
      fi = <i className="fa fa-upload"></i>;
      break;
    case "uploading":
      fi = <i className="fa fa-spin fa-refresh"></i>;
      break;
    case "success":
      fi = <i className="fa fa-check"></i>;
      break;
    case "error":
      fi = <i className="fa fa-exclamation-triangle"></i>;
      break;
    }
    return fi;
  },
  render: function() {
        // if (this.state.uploadStatus == 'uploading'){
    return (
            <button type="button"
                className="btn btn-default"
                ref="submitBtn"
                onClick={this.props.handleSubmit}
                disabled={this.state.disabled}>
                {this.renderFa(this.props.uploadStatus)} Upload Image
            </button>);
  }
});

var AddLinkModal = React.createClass({
  mixins: [ModalButtonMixin],
  addLink: function(editor) {
    var title = this.refs.linkTitleInput.getValue();
    var link = this.refs.linkUrlInput.getValue();
    if(title != ""){
      if(editor.getSelection() == ""){
        editor.replaceSelection("[" + title + "](" + link + " \"" + title + "\")");
      }else{
        editor.replaceSelection("[" + editor.getSelection() + "](" + link + " \"" + title + "\")");
      }
    } else {
      if(editor.getSelection() == ""){
        editor.replaceSelection("<" + link + ">");
      }else{
        editor.replaceSelection("[" + editor.getSelection() + "](" + link + ")");
      }
    }
    this.close();
  },
  handleSubmit: function () {
    var f = this.addLink;
    this.props.onEvent(f);
  },
  render: function() {
    return (
                <Button bsSize="xs" ref="link" onClick={this.open}>
                    <i className="fa fa-link"></i>
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add A Comment</Modal.Title>
                    </ Modal.Header>
                    <Modal.Body >
                        <Input ref="linkTitleInput" type="text" label="Title" placeholder="Add Link here" />
                        <Input ref="linkUrlInput" type="text" label="URL" placeholder="Add URL here" />
                        <ButtonInput value="Add Link" onClick={this.handleSubmit}/>
                    </ Modal.Body>
                </ Modal>
                </Button>
        );
  }
});


exports.ImageUploadModal = ImageUploadModal;
exports.CommentModal = CommentModal;
exports.AddLinkModal = AddLinkModal;


import { Contact } from "../model/contactUs.js";
import { contactValidation } from "../validation.js";

//!! allMessage, createMessage, messageDetails, deleteMessage

//!!get All messages
export const allMessage =  async (req, res) => {
    Contact.find()
      .sort({ createdAt: -1 })
      .then((result) => {
        return res.status(200).json({ title: "All messages", status: 200, messages: result });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({status: 500, message: "Internal server error" });
      });
  };

//!!Posting new message
export const createMessage = async (req, res) =>{
    const { error } = contactValidation(req.body);

    if (error) return res.status(400).json({status: 400, message: error.details[0].message });
  
    //!!creating new message
    var contact = new Contact({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
    });
  
    //!!save a message to db
    try {
      const savedMessage = await contact.save();
      console.log(savedMessage.id);
      return res
        .status(201)
        .json({status: 201, message: "Successfully sent, we will talk soon." });
    } catch (error) {
      return res.status(500).json({status: 500, message: "Internal server" });
    }
}


//!!get one message
export const messageDetails = async (req, res) =>{
    const id = req.params.id;

    if (!id) return res.status(404).json({status: 404, message: "Message not found" });
  
    Contact.findById(id)
      .then((result) => {
        return res
          .status(200)
          .json({ title: "Message details", status: 200, message: result });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({status: 500, message: "Internal server error" });
      });
}


//!!Delete a Message
export const deleteMessage = async (req, res) =>{
    const id = req.params.id;

    const result = await Contact.findById(id);
    if (!result) return res.status(404).json({status: 404, message: "Message not found" });
  
    const contactDelete = await result.delete();
  
    if (contactDelete)
      return res.status(200).json({status: 200, message: "Message successfully deleted" });
  
    return res.status(500).json({status: 500, message: "Internal server error" });
}
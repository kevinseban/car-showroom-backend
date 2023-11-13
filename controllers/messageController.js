const Message = require('../models/Message');

const sendMessage = async (req, res) => {
  const { messName, messEmail, messPhone, messMessage } = req.body;
  try {
    const newMess = new Message({ messName, messEmail, messPhone, messMessage });
    await newMess.save();
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message: ', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const messid = req.query.messid;
    await Message.deleteOne({ _id: messid });
    res.send('deleted');
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  deleteMessage,
};

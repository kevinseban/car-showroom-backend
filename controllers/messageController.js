const Message = require('../models/message');

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

const searchMessages = async (req, res) => {
  try {
    const { searchQuery } = req.params;
    // Use a case-insensitive regular expression for searching
    const regex = new RegExp(searchQuery, 'i');

    const searchResults = await Message.find({
      $or: [
        { messName: regex },   
        { messEmail: regex },    
        { messPhone: regex },     
        { messMessage: regex },   
      ],
    });

    res.json(searchResults);
  } catch (error) {
    console.error('Error searching for messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const searchMessagesByDate = async (req, res) => {
  try {
    const { searchDate } = req.params;
    const istStartDate = new Date(`${searchDate}T00:00:00.000+05:30`);
    const istEndDate = new Date(`${searchDate}T23:59:59.999+05:30`);

    const searchResults = await Message.find({
      createdAt: { $gte: istStartDate, $lt: istEndDate },
    });

    res.json(searchResults);
  } catch (error) {
    console.error('Error searching for messages by date:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = {
  sendMessage,
  getMessages,
  deleteMessage,
  searchMessages,
  searchMessagesByDate
};

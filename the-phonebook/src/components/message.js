const Message = ({ message }) => {
  if (message === null) {
    return null;
  } else {
    return <div className="message">{message}</div>;
  }
};

export default Message;

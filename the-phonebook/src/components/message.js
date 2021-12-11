const Message = ({ message, errorOrNot }) => {
  if (message === null) {
    return null;
  } else if (errorOrNot) {
    return <div className="errorMessage">{message}</div>;
  } else {
    return <div className="message">{message}</div>;
  }
};

export default Message;

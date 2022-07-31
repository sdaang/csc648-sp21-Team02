import {useState} from 'react'
import Modal from './Modal'
import axios from 'axios'
import Select from 'react-select';
import {components} from 'react-select'


import styles from './SendMessage.module.css';

const {Option} = components

function SendMessage({display,onClose, profile, recipientOptions}) {

    const [sendSuccess,setSendSuccess] = useState(false);

    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    const [recipient,setRecipient] = useState([]);

    function sendMessage(event){
        event.preventDefault();

        axios.post("/api/message",{
            messageSubject: subject,
            messageBody: body,
            recipientProfileID: recipient[0].value     //contains profile id
        })
        .then(response => {
            console.log(response);
            onClose();
        })
        .catch(err =>{
            console.log(err);
            //display Error message e.g: try again
        })
    }

    function customTheme(theme){
        return {
            ... theme,
            colors:{
                ... theme.colors,
                primary25: '#B3B3B3',
                primary:'#1CB48F',
            }
        }
    }

    const RecipientOption = (props) => (
        <Option {...props}>
            <img className={styles['option-recipient-image']} src={props.data.pic}/>
            <span className={styles['option-recipient-name']}>{props.data.label}</span>
        </Option>
    );

    if(!display) return null
    return (
        <Modal display={display} onClose={onClose}>
            <>
                <h1 className={styles["sendAMessage-header"]}>Send a Message</h1>
                <form className={styles['send-a-message-container']} onSubmit={sendMessage}>
                    <Select id="recipient" name="message-recipient" className={styles["sendAMessage-recipient"]}
                        onChange={event => setRecipient([event])}
                        value={recipient}
                        options={recipientOptions}
                        theme={customTheme}
                        components={{Option: RecipientOption}}
                        placeholder="To"
                        isSearchable
                    />
                    <input className={styles["sendAMessage-subject"]} maxLength={78} required placeholder="Subject" value={subject} onChange={(event) =>setSubject(event.target.value)}/>
                    <textarea className={styles["sendAMessage-body"]} maxLength={65535} value={body} required placeholder="Write your message here" onChange={(event) =>setBody(event.target.value)}/>
                    <button type="submit" class={styles["sendAMessage-sendButton"]} >Send</button>
                </form>
            </>
        </Modal>
    )
}
export default SendMessage

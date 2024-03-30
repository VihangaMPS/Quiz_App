function NextButton({dispatch, answer, index, numQuestions}) {
    if (answer === null) return null;

    if (index < numQuestions -1) { // stopping next btn in 14 index
        return (
            <button className="btn btn-ui" onClick={() => dispatch({type: 'nextQuestion'})}>Next</button>
        );
    }
    if (index === numQuestions -1) { // adding a new btn in last(15) index
        return (
            <button className="btn btn-ui" onClick={() => dispatch({type: 'finish'})}>Finish</button>
        );
    }
}

export default NextButton;
import Header from "./components/Header";
import Main from "./components/Main";
import {useEffect, useReducer} from "react";
import Loader from "./components/Loader";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import question from "./components/Question";

function reducer(state, action) {
    switch (action.type) {
        case 'dataReceived': return {...state, questions: action.payload, status: 'ready'};
        case 'dataFailed': return {...state, status: 'error'};
        case 'start': return {...state, status: 'active'};
        case 'newAnswer':
            const question = state.questions.at(state.index);
            return {...state, answer: action.payload, points: action.payload === question.correctOption ? state.points +question.points : state.points};

        default : throw new Error("Action Unknown !");
    }
}

const initialState = {
    questions: [],
    // loading, error, ready, active, finished
    status: 'loading',
    index: 0,
    answer: null,
    points: 0,
}

export default function App() {

    const [{questions, status, index, answer, points}, dispatch] = useReducer(reducer, initialState);

    const numQuestions = questions.length;

    useEffect(() => {
        fetch("http://localhost:8000/questions")
            .then((res) => res.json())
            .then((data) => dispatch({type: 'dataReceived', payload: data}))
            .catch((err) => dispatch({type: 'dataFailed'}));
    }, []);

    return (
        <div className="app">
            <Header/>

            <Main>
                {status === 'loading' && <Loader/>}
                {status === 'error' && <Loader/>}
                {status === 'ready' && <StartScreen numOfQuestions={numQuestions} dispatch={dispatch}/>}
                {status === 'active' && <Question question={questions[index]} dispatch={dispatch} answer={answer}/>}
            </Main>
        </div>
    );
}
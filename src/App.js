import Header from "./components/Header";
import Main from "./components/Main";
import {useEffect, useReducer} from "react";
import Loader from "./components/Loader";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishedScreen from "./components/FinishedScreen";
import Timer from "./components/Timer";
import Footer from "./components/Footer";

const initialState = {
    questions: [],
    // loading, error, ready, active, finished
    status: 'loading',
    index: 0,
    answer: null,
    points: 0,
    highscore: 0,
    secondsRemaining: 10,
}
function reducer(state, action) {
    switch (action.type) {
        case 'dataReceived':
            return {...state, questions: action.payload, status: 'ready'};
        case 'dataFailed':
            return {...state, status: 'error'};
        case 'start':
            return {...state, status: 'active'};
        case 'newAnswer':
            const question = state.questions.at(state.index);
            return {
                ...state, answer: action.payload,
                points: action.payload === question.correctOption ? state.points + question.points : state.points
            };
        case 'nextQuestion' :
            return {...state, index: state.index + 1, answer: null};
        case 'finish' :
            return {
                ...state,
                status: 'finished',
                highscore: state.points > state.highscore ? state.points : state.highscore
            }
        case 'restart': return {...initialState, question : state.questions, status: 'ready'};
                        /*return {...state, points: 0, highscore: 0, index: 0, answer: null, status: 'ready'}*/
        case 'tick':
            return {...state, secondsRemaining: state.secondsRemaining -1,
                status: state.secondsRemaining === 0 ? 'finished' : state.status};

        default :
            throw new Error("Action Unknown !");
    }
}

export default function App() {

    const [{questions, status, index, answer, points, highscore, secondsRemaining}, dispatch] = useReducer(reducer, initialState);

    const numQuestions = questions.length;
    const macPossiblePoints = questions.reduce((prev, curr) => prev + curr.points, 0);

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
                {status === 'active' &&
                    <>
                        <Progress index={index} numQuestions={numQuestions} points={points}
                                    maxPossiblePoints={macPossiblePoints} answer={answer}/>
                        <Question question={questions[index]} dispatch={dispatch} answer={answer}/>
                        <Footer>
                            <Timer dispatch={dispatch} secondsRemaining={secondsRemaining}/>
                            <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions}/>
                        </Footer>
                    </>
                }
                {status === 'finished' && <FinishedScreen points={points}
                                                            maxPossiblePoints={macPossiblePoints} dispatch={dispatch()}/>}
            </Main>
        </div>
    );
}
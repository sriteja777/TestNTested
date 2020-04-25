import React, { Component } from 'react';
import {Link, Redirect} from "react-router-dom";


export class play extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            genre: "",
            questions: [],
            options: [],
            checkedAns: [],
            rightAns: [],
            quesType: [],
            submitted: false,
            score: 0
        };
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(event) {
        event.preventDefault();
        this.forceUpdate();


        this.state.checkedAns.map((ele, i) => {
            this.state.checkedAns[i].sort();
            this.state.rightAns[i].sort();
            console.log(ele, this.state.rightAns[i]);
            if (JSON.stringify(ele) === JSON.stringify(this.state.rightAns[i]))  {
                this.setState(prevState => {
                    prevState.score += 10;
                    return prevState
                });
                console.log("came here");
            }

        });

        this.state.submitted = true;
        console.log("came")

    }


    componentDidMount() {
        let quizId = this.props.match.params.quizId;
        // console.log("quiz_id             ", quizId);
        const request = new Request('http://127.0.0.1:7777/quiz/' + quizId);
        fetch(request).then(response => response.json()).then(data => {this.setState(prevState => {
            prevState.questions = data.questions;
            prevState.options = data.options;
            prevState.quesType = data.quesType;
            prevState.rightAns = data.rightAns;
            prevState.title = data.quiz.title;
            prevState.genre = data.quiz.genre;
            for (let i=0;i<prevState.rightAns.length; i++) prevState.checkedAns.push([])
            return prevState;
        }); console.log(this.state.questions)});
    }

    handleCorrectOption(question, option, event) {
        // console.log('onchange came');
        const val = !event.target.checked;                                                  // Used not because it is returning reverse unexpected behavior
        this.setState(prevState => {
            let temp = prevState.quesType[question];
            if (temp === 1)  {
                // console.log('temp 1 came', val);
                if (val === true) {
                    // console.log('var true came');
                    let index = prevState.checkedAns[question].indexOf(option);
                    if (index > -1) {
                        prevState.checkedAns[question].splice(index, 1);
                    }
                }
                else {
                    prevState.checkedAns[question].push(option);

                }
            }
            else if (temp === 0) prevState.checkedAns[question][0] = option;
            return prevState
        })
    }

    renderCorrectOptionInput(question, option) {
        if (this.state.quesType[question] === 0) {
            return (
                <input type="radio" name={question} value="0" checked={this.state.checkedAns[question].includes(option)} onChange={this.handleCorrectOption.bind(this, question, option)}/>
            )
        }
        else if (this.state.quesType[question] === 1) {
            return (
                <input type="checkbox" name={question} value="0" checked={this.state.checkedAns[question].includes(option)} onClick={this.handleCorrectOption.bind(this, question, option)}/>
            )
        }

    }


    render() {
        if (!sessionStorage.getItem("userData")) {
            return (
                <Redirect to={'/login/'}/>
            )
        }
        return (
            <div style={{textAlign: 'center'}}>
                <form onSubmit={this.handleSubmit}>
                    <h3>{this.state.title}</h3>
                    <h4>Genre: {this.state.genre}</h4>
                        {/*<select value={this.state.genre} onChange={this.handleGenreChange} required>*/}
                        {/*<option value="Select Genre">Select Genre</option>*/}
                        {/*{this.state.genres.map((item) => {*/}
                            {/*return(*/}
                                {/*<option value={item}>{item}</option>*/}
                            {/*)*/}
                        {/*})*/}
                        {/*}*/}

                    {/*</select>*/}
                    <br/>
                    {this.state.questions.map((item, key) => {
                        return(
                            <div>
                                Question {key+1}&nbsp;
                                <span>
                                    <label>
                                        <input className={key} type="radio" value="0" checked={this.state.quesType[key] === 0 }/>
                                        Single MCQ
                                    </label>
                                </span>
                                <span>
                                    <label>
                                        <input className={key} type="radio" value="1" checked={this.state.quesType[key] === 1 }/>
                                        Multiple MCQ
                                    </label>
                                </span>

                                <br/>

                                <textarea rows="5" id={key} value={item} required/>

                                <br/>
                                <ol type="a">
                                    {this.state.options[key].map((i, k) => {
                                        return (
                                            <div>
                                                <li><input type="text" value={i} required />
                                                    <label>
                                                        &nbsp;Is Correct
                                                        {this.renderCorrectOptionInput.bind(this, key, k)()}
                                                    </label>
                                                </li>
                                            </div>
                                        )
                                    })}
                                </ol>
                                <br/>
                                <br/>
                            </div>

                        )
                    })}
                    <br/>
                    <br/><br/>
                    <button type="submit">Submit</button>

                </form>
                {this.state.submitted &&
                <div>
                    Your Score: {this.state.score}
                </div>}
            </div>
        )

    }
}


export default class playQuiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quizzes: [],
            selectedGenre: 'All',
            genres: [],
            viewQuizzes: true,
            match: props.match
        };
        this.handleGenreChange = this.handleGenreChange.bind(this);
        this.renderQuiz = this.renderQuiz.bind(this);
        this.playSelectedQuiz = this.playSelectedQuiz.bind(this)
    }
    componentDidMount() {
        console.log('came');
        const request = new Request('http://127.0.0.1:7777/quiz/');
        fetch(request).then(response => response.json()).then(quizzes => {this.setState({quizzes: quizzes})});
        const request2 = new Request('http://127.0.0.1:7777/genres/');
        fetch(request2).then(response => response.json()).then(genres => {this.setState({genres: genres})});
        console.log(this.state.match)
    }

    handleGenreChange(event) {
        this.setState({selectedGenre: event.target.value})
    }

    playSelectedQuiz() {

        // this.setState({viewQuizzes: false});

        {/*<Route path={`${match.url}/:topicId`} component={Topic} />*/}
    }

    renderQuiz() {
        if (!sessionStorage.getItem("userData")) {
            return (
                <Redirect to={'/login/'}/>
            )
        }
        let quizzes = [];
        if (this.state.selectedGenre === "All") quizzes = this.state.quizzes;
        else quizzes = this.state.quizzes.filter(quiz => quiz.genre === this.state.selectedGenre);
        return (
            <tbody>
            {quizzes.map((quiz, key) => {
                return (
                    <tr key={key}>
                        <td>{key + 1}</td>
                        <td>{quiz.title}</td>
                        <td>{quiz.genre}</td>
                        <td>
                            {/*<button type="button" id={quiz.id} onClick={this.playSelectedQuiz}>Play</button>*/}
                            <Link to={`${this.props.match.url}/${quiz.id}`}>Play</Link>
                        </td>
                    </tr>
                )
            })}
            </tbody>
        )


    }

    render() {
        if  (this.state.viewQuizzes) {
            return (
                <div>
                    <div>
                        Filter genres
                        <select value={this.state.selectedGenre} onChange={this.handleGenreChange} required>
                            <option value="All">All</option>
                            {this.state.genres.map((item) => {
                                return (
                                    <option value={item}>{item}</option>
                                )
                            })
                            }

                        </select>
                    </div>
                    <table className="table-hover">
                        <thead>
                        <tr>
                            <th>S.NO&emsp;</th>
                            <th>Quiz Title&emsp;</th>
                            <th>Genre&emsp;</th>
                            <th>&nbsp;</th>
                        </tr>
                        </thead>
                        {this.renderQuiz()}
                    </table>
                    {/*<Route*/}
                      {/*exact*/}
                      {/*path={this.props.match.url}*/}
                      {/*render={() => <h3>Please select a topic.</h3>}*/}
                    {/*/>*/}
                </div>
            )
        }
        else return null
    }
}


import React, { Component } from 'react';
import './createQuiz.css'
import {Redirect} from "react-router-dom";

class createQuiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                title: "",
                genre: "Select Genre",
                questions: ["", "", "", "", ""],
                options: [["", "", "", ""], ["", "", "", ""], ["", "", "", ""], ["", "", "", ""], ["", "", "", ""]],
                rightAns: [[], [], [], [], []],
                quesType: [0, 0, 0, 0, 0]
            },
            genres: [],
            submitted: false
        };
        this.handleGenreChange = this.handleGenreChange.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddQuestion = this.handleAddQuestion.bind(this);
        this.handleRemoveQuestion = this.handleRemoveQuestion.bind(this);
        this.handleQuesTypeChange = this.handleQuesTypeChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
    }

    componentDidMount() {
        console.log('came');
        const request = new Request('http://127.0.0.1:7777/genres/');
        fetch(request).then(response => response.json()).then(genres => {this.setState({genres: genres}); console.log(this.state.genres)});
        // console.log(this.state.genres)

    }

    handleSubmit(event) {
        event.preventDefault();
        fetch('http://localhost:7777/quiz/', {
            method: 'POST',
            body: JSON.stringify(this.state.formData),
                }
            ).then(response => {
        if(response.status >= 200 && response.status < 300)
          this.setState({submitted: true});
      });
    }

    handleTitleChange(event) {
        const val = event.target.value;
        this.setState(prevState => {
            prevState.formData.title = val;
            return prevState
        })
    }

    handleGenreChange(event) {
        const value = event.target.value;
        this.setState(prevState => {
            prevState.formData.genre = value;
            return prevState
        });
    }
    handleQuestionChange(event) {
        const value = event.target.value;
        const id = event.target.id;
        console.log(this.state.formData.questions.length);
        this.setState(prevState => {
            prevState.formData.questions[id] = value;
            return prevState
        })
        // const new_form_data = React.cloneElement(this.state.formData);
        // new_form_data['questions'][id] = value;
        // this.setState({formData: new_form_data})
    }
    handleAddQuestion() {
        this.setState(prevState => {
            prevState.formData.questions.push("");
            prevState.formData.options.push(["", "", "", ""]);
            prevState.formData.quesType.push(0);
            prevState.formData.rightAns.push([]);
            return prevState
        })
    }
    handleRemoveQuestion() {
        this.setState(prevState => {
            prevState.formData.questions.pop();
            prevState.formData.options.pop();
            prevState.formData.quesType.pop();
            prevState.formData.rightAns.pop();
            return prevState
        })
    }
    handleQuesTypeChange(event) {
        const id = parseInt(event.target.className);
        const val = parseInt(event.target.value);
        this.setState(prevState => {
            prevState.formData.quesType[id] = val;
            prevState.formData.rightAns[id] = [];
            return prevState;
        } )

    }
    handleOptionChange(question, option, event) {
        console.log(event, question, option);
        const val = event.target.value;
        this.setState(prevState => {
            prevState.formData.options[question][option] = val;
            return prevState
        })

    }

    handleCorrectOption(question, option, event) {
        // console.log('onchange came');
        const val = !event.target.checked;                                                  // Used not because it is returning reverse unexpected behavior
        this.setState(prevState => {
            let temp = prevState.formData.quesType[question];
            if (temp === 1)  {
                // console.log('temp 1 came', val);
                if (val === true) {
                    // console.log('var true came');
                    let index = prevState.formData.rightAns[question].indexOf(option);
                    if (index > -1) {
                        prevState.formData.rightAns[question].splice(index, 1);
                    }
                }
                else {
                    prevState.formData.rightAns[question].push(option);

                }
            }
            else if (temp === 0) prevState.formData.rightAns[question][0] = option;
            return prevState
        })
    }

    handleAddOption(question) {
        this.setState(prevState => {
            prevState.formData.options[question].push("");
            return prevState
        })
    }
    handleRemoveOption(question) {
        console.log(this.state.formData.rightAns[question]);
        this.setState(prevState => {
            prevState.formData.options[question].pop();
            let l = prevState.formData.options[question].length;
            let index = prevState.formData.rightAns[question].indexOf(l);
                    if (index > -1) {
                        prevState.formData.rightAns[question].splice(index, 1);
                    }
            return prevState
        })
    }

    renderCorrectOptionInput(question, option) {
        if (this.state.formData.quesType[question] === 0) {
            return (
                <input type="radio" name={question} value="0" checked={this.state.formData.rightAns[question].includes(option)} onChange={this.handleCorrectOption.bind(this, question, option)} required/>
            )
        }
        else if (this.state.formData.quesType[question] === 1) {
            return (
                <input type="checkbox" name={question} value="0" checked={this.state.formData.rightAns[question].includes(option)} onClick={this.handleCorrectOption.bind(this, question, option)}/>
            )
        }

    }
    render() {
        if (!sessionStorage.getItem("userData")) {
            return (
                <Redirect to={'/login/'}/>
            )
        }
        let listKey = 100;
        return (
            <div style={{textAlign: 'center'}}>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Quiz Title
                        <br/>
                        <input type="text" value={this.state.formData.title} onChange={this.handleTitleChange} required/>
                        <br/>
                    </label>
                        <select value={this.state.formData.genre} onChange={this.handleGenreChange} required>
                        <option value="Select Genre">Select Genre</option>
                        {this.state.genres.map((item) => {
                            return(
                                <option value={item}>{item}</option>
                            )
                        })
                        }

                    </select>
                    <br/>
                    {this.state.formData.questions.map((item, key) => {
                        return(
                            <div>
                                Question {key+1}&nbsp;
                                <span>
                                    <label>
                                        <input className={key} type="radio" value="0" checked={this.state.formData.quesType[key] === 0 } onChange={this.handleQuesTypeChange}/>
                                        Single MCQ
                                    </label>
                                </span>
                                <span>
                                    <label>
                                        <input className={key} type="radio" value="1" checked={this.state.formData.quesType[key] === 1 } onChange={this.handleQuesTypeChange}/>
                                        Multiple MCQ
                                    </label>
                                </span>

                                <br/>

                                <textarea rows="5" id={key} value={item} onChange={this.handleQuestionChange} required/>

                                <br/>
                                <ol type="a">
                                    {this.state.formData.options[key].map((i, k) => {
                                        return (
                                            <div>
                                                <li><input type="text" value={i} onChange={this.handleOptionChange.bind(this, key, k)} required/>
                                                    <label>
                                                        &nbsp;Is Correct
                                                        {this.renderCorrectOptionInput.bind(this, key, k)()}
                                                    </label>
                                                </li>
                                            </div>
                                        )
                                    })}
                                </ol>
                                <button type="button" onClick={this.handleAddOption.bind(this, key)}>Add Option</button>
                                <button type="button" onClick={this.handleRemoveOption.bind(this, key)}>Remove Option</button>
                                <br/>
                                <br/>
                            </div>

                        )
                    })}
                    <br/>
                    <button type="button" onClick={this.handleAddQuestion}>Add Question</button>
                    <button type="button" onClick={this.handleRemoveQuestion}>Remove Question</button>
                    <br/><br/>
                    <button type="submit">Submit</button>

                </form>
            </div>
        )
    }
}

export default createQuiz
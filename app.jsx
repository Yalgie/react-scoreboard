var PLAYERS = [
    {
        name: "Name 1",
        score: 1,
        id: 1
    },
    {
        name: "Name 2",
        score: 12,
        id: 2
    },
    {
        name: "Name 3",
        score: 13,
        id: 3
    },
    {
        name: "Name 4",
        score: 13,
        id: 4
    }
];

var Stopwatch = React.createClass({
    getInitialState: function() {
        return {
            running: false,
            elapsedTime: 0,
            previousTime: 0
        }
    },
    componentDidMount: function() {
        this.interval = setInterval(this.onTick, 100);
    },
    componentWillUnmount: function() {
        clearInterval(this.interval);
    },
    onTick: function() {
        if (this.state.running) {
            var now = Date.now();
            var current = this.state.elapsedTime;
            var prev = this.state.previousTime;
            this.setState({
                previousTime: now,
                elapsedTime: current + (now - prev)
            })
        }
    },
    onStart: function() {
        this.setState({
            running: true,
            previousTime: Date.now()
        });
    },
    onStop: function() {
        this.setState({
            running: false
        });
    },
    onReset: function() {
        this.setState({
            elapsedTime: 0,
            previousTime: Date.now()
        });
    },
    render: function() {
        var seconds = Math.floor(this.state.elapsedTime / 1000);
        var startStop;
        
        if (this.state.running) {
            startStop = <button onClick={this.onStop}>Stop</button>
        }
        else {
            startStop = <button onClick={this.onStart}>Start</button>
        }

        return (
            <div className="stopwatch">
                <h2>Stopwatch</h2>
                <div className="stopwatch-time">{ seconds }</div>
                { startStop }
                <button onClick={this.onReset}>Reset</button>
            </div>
        );
    }
});

var AddPlayerForm = React.createClass({
    propTypes: {
        onAdd: React.PropTypes.func.isRequired
    },
    getInitialState: function() {
        return {
            name: ""
        }
    },
    onNameChange: function(e) {
        this.setState({
            name: e.target.value
        });
    },
    onSubmit: function(e) {
        e.preventDefault();
        this.props.onAdd(this.state.name);
        this.setState({
            name: ""
        })
    },
    render: function() {
        return (
            <div className="add-player-form">
                <form onSubmit={this.onSubmit}>
                    <input 
                        type="text" 
                        placeholder="Enter Name" 
                        value={this.state.name}
                        onChange={this.onNameChange}
                    />
                    <input 
                        type="submit" 
                        value="Add Player" 
                    />
                </form>
            </div>
        )
    }
});

function Stats(props) {
    var totalPlayers = props.players.length;
    var totalScore = props.players.reduce(function(total, player) {
        return total + player.score;
    }, 0);

    return(
        <table className="stats">
            <tbody>
                <tr>
                    <td>Players</td>
                    <td>{totalPlayers}</td>
                </tr>
                <tr>
                    <td>Score</td>
                    <td>{totalScore}</td>
                </tr>
            </tbody>
        </table>
    );
}

Stats.propTypes = {
    players: React.PropTypes.array.isRequired
}

function Header(props) {
    return(
        <div className="header">
            <Stats players={props.players} />
            <h1>{props.title}</h1>
            <Stopwatch />
        </div>
    );
}

Header.propTypes = {
    title: React.PropTypes.string.isRequired,
    players: React.PropTypes.array.isRequired
};

function Counter(props) {
    return (
        <div className="counter">
            <button className="counter-action decrement" onClick={function() {
                {props.onChange(-1)}
            }}>-</button>
            <div className="counter-score">{props.score}</div>
            <button className="counter-action increment" onClick={function() {
                {props.onChange(+1)}
            }}>+</button>
        </div>
    );
}

Counter.propTypes = {
    score: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired
}

function Player(props) {
    return(
        <div className="player">
            <div className="player-name">
                <a 
                    href="javascript:void(0)" 
                    className="remove-player"
                    onClick={props.onRemove}>
                    X
                </a>
                {props.name}
            </div>
            <div className="player-score">
                <Counter 
                    score={props.score} 
                    onChange={props.onScoreChange} 
                />
            </div>
        </div>
    );
}

Player.propTypes = {
    name: React.PropTypes.string.isRequired,
    score: React.PropTypes.number.isRequired,
    onScoreChange: React.PropTypes.func.isRequired,
    onRemove: React.PropTypes.func.isRequired
};

var Application = React.createClass({
    propTypes: {
        title: React.PropTypes.string,
        inititalPlayers: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                name: React.PropTypes.string.isRequired,
                id: React.PropTypes.number.isRequired
            })
        ).isRequired
    },
    getDefaultProps: function() {
        return {
            title: "Scoreboard"
        }
    },
    getInitialState: function() {
        return {
            players: this.props.inititalPlayers
        }
    },
    onScoreChange: function(i, delta) {
        this.state.players[i].score += delta;
        this.setState(this.state);
    },
    onPlayerAdd: function(name) {
        if (name.length > 0) {
            this.state.players.push({
                name: name,
                score: 0,
                id: this.state.players.length + 1
            })
            this.setState(this.state);
        }
    },
    onPlayerRemove: function(i) {
        this.state.players.splice(i, 1);
        this.setState(this.state);
    },
    render: function() {
        return (
            <div className="scoreboard">
                <Header 
                    title={this.props.title} 
                    players={this.state.players} 
                />

                <div className="players">
                    {this.state.players.map(function (player, i) {
                        return (
                            <Player
                                name={player.name}
                                score={player.score}
                                key={player.id}
                                onScoreChange={function(delta) {
                                    this.onScoreChange(i, delta)
                                }.bind(this)}
                                onRemove={function() {
                                    this.onPlayerRemove(i)
                                }.bind(this)}
                            />
                        );
                    }.bind(this))}
                </div>

                <AddPlayerForm onAdd={this.onPlayerAdd}/>
            </div>
        );
    }
})

ReactDOM.render(<Application inititalPlayers={PLAYERS} />, document.getElementById('container'));
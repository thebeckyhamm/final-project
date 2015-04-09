(function(views){
    var SingleGoalProgress = React.createBackboneClass({
        // getGoalDetail: function(goal_id, e) {
        //     e.preventDefault();
        //     app.trigger("get:goal:detail", goal_id);

        // },

        getCurrentTotal: function(entries) {
            var entryNumbers = [];
            _.each(entries, function(obj) {
                entryNumbers.push(parseInt(obj.number));
            });
            return _.reduce(entryNumbers, function(a, b) {
                return a + b;
            });
        },

        getPercentComplete: function(progress, end) {
            var percentComplete = ((progress / end) * 100).toFixed(1);
            return percentComplete + "%";
        },

        render: function() {
            var goal = this.props.model.toJSON();
            var entries = goal.entries;

            // get the end of the competition number
            var totalGoal = goal.number * this.props.team.weeks;

            // if the entries object is empty
            if (_.isEmpty(entries)) {
                var currentProgress = 0;
                var percentComplete = "0%";
                var progressStyle = {
                    width: percentComplete 
                }    
            }
            else {
                var currentProgress = this.getCurrentTotal(entries);
                var percentComplete = this.getPercentComplete(currentProgress, totalGoal);
                var progressStyle = {
                    width: percentComplete 
                }  
            }

            // calculate the marker for how far along we are in the competition
            var totalWeeks = this.props.team.weeks;
            var weeksComplete = this.getPercentComplete(this.props.week, totalWeeks);

            var goalName = goal.name + " " + 
                       goal.number + " " + 
                       goal.unit + " " + 
                       "per week";

            var weekLine = {
                marginLeft: weeksComplete 
            }
            return (
                <div className="goal-progress" key={this.props.key}>
                    <h4>{goalName}</h4>
                    <div className="progress-container" data-percent={percentComplete}>
                        <div className="progress-bar" style={progressStyle} />
                        <div className="progress-week" style={weekLine} />

                    </div>
                    <span className="goal-info">{currentProgress} {goal.unit} completed out of {totalGoal} </span>
                </div>
            );
        }

    });


var TotalProgress = React.createBackboneClass({

    getCurrentTotal: function(existingEntries) {
        var entryNumbers = [];
        entryNumbers = _.flatten(existingEntries);

        entryNumbers = _.map(entryNumbers, function(obj) {
            return parseInt(obj.number);
        });

        return _.reduce(entryNumbers, function(a, b) {
            return a + b;
        });

    },

    getTotal: function(goals) {

        var goalNumbers = _.map(goals, function(goal) {
            return parseInt(goal.number);
        });

        var total = _.reduce(goalNumbers, function(a, b) {
            return a + b;
        });

        return total;

    },

    getPercentComplete: function(progress, end) {
        var percentComplete = ((progress / end) * 100).toFixed(1);

        return percentComplete + "%";

    },

    addMessage: function(weeksComplete, percentComplete) {
        var weeks = weeksComplete.slice(0, weeksComplete.length-1);
        var percent = percentComplete.slice(0, percentComplete.length-1);

        var diff = percent - weeks;

        if (diff < -15) {

            var msgs = [
                "Did you forget to add some entries?",
                "Sleep in again?",
                "Get back in that saddle!",
                "Money is no object, right?",
                ""

            ]
            var rand = Math.floor(Math.random() * (3 - 0));
            var msg = msgs[rand];

            if (!(msg === "")) {
                return <h4 className="progress-message"><span>{msg}</span></h4>;
            }


        }

        else if (diff < -5 ) {

            var msgs = [
                "Getting behind! Step it up!",
                "Sweating yet?",
                ""
            ]
            var rand = Math.floor(Math.random() * (3 - 0));
            var msg = msgs[rand];

            if (!(msg === "")) {
                return <h4 className="progress-message"><span>{msg}</span></h4>;
            }
        }

        if (diff > 5) {
            var msgs = [
                "Kickin' butt and takin' names!",
                "Get it!",
                "Show me the money",
                "",
                ""

            ]
            var rand = Math.floor(Math.random() * (3 - 0));
            var msg = msgs[rand];

            if (!(msg === "")) {
                return <h4 className="progress-message"><span>{msg}</span></h4>;
            }

        }
    },

    render: function() {
        var goals = this.props.collection.toJSON();


        var entries = goals.map(function(goal) {
            return goal.entries;
        });

        var existingEntries = _.filter(entries, function(entry) {
            return !_.isEmpty(entry);
        });

        var totalGoals = this.getTotal(goals);
        var totalWeeks = this.props.team.weeks;

        var endAmount = totalGoals * totalWeeks;
        var weeksComplete = this.getPercentComplete(this.props.week, totalWeeks);


        if (_.isEmpty(existingEntries)) {
          var currentProgress = 0;
          var percentComplete = "0%";
          var progressStyle = {
              width: percentComplete 
          }    
        }
        else {
            var currentProgress = this.getCurrentTotal(existingEntries);
            var percentComplete = this.getPercentComplete(currentProgress, endAmount);
            var progressStyle = {
                width: percentComplete 
            }  
        }

        var weekLine = {
            marginLeft: weeksComplete 
        }

        var message = this.addMessage(weeksComplete, percentComplete);


        return (

            <div className="goal-progress">
                {message}
                <h3>Total Progress</h3>
                <div className="progress-container" data-percent={percentComplete}>
                    <div className="progress-bar" style={progressStyle} />
                    <div className="progress-week" style={weekLine} />
                </div>
            </div>
        );
    }

});

    views.MyDash = React.createBackboneClass({

        getGoal: function(team, currentWeek, model, index) {
            return <SingleGoalProgress 
                    key={index} 
                    model={model} 
                    team={team}
                    week={currentWeek} />;
        },

        getTotal: function(team, currentWeek) {
            return <TotalProgress 
                    collection={this.props.collection} 
                    team={team} 
                    week={currentWeek} />
        },

        goalButton: function(daysFromStart) {
            if (daysFromStart < 0) {
                return (
                    <button 
                        className="button button-primary"
                        onClick={this.props.addGoal}>+ Goal
                    </button>
                )
            }
        },

        entryButton: function(daysFromStart) {
            if (daysFromStart >= 0) {
                return (
                    <button className="button button-primary"
                        onClick={this.props.addEntry}>+ Entry
                    </button>
                )
            }
        },

        render: function() {
            var team = this.props.getTeam();
            team = team.toJSON();

            var start_date = moment(team.start_date);
            var now = moment();

            var daysFromStart = now.diff(start_date, 'days');

            var currentWeek = Math.ceil(daysFromStart / 7);



            return (
                <section className="main">
                    <header className="header-main">
                        <h2>My Goals</h2>
                    </header>
                    <div className="flex dashboard">
                        <div className="header-meta order-1">
                            <div className="team-data">
                                <div className="week">
                                    <span className="label">Week:</span>
                                    <span>{currentWeek}</span>
                                </div>
                                <div className="team-name">
                                    <span className="label">Team Name:</span>
                                    <span>{team.name}</span>
                                </div>

                            </div>
                            <div className="button-toggle-sm">  
                                {this.goalButton(daysFromStart)}
                                {this.entryButton(daysFromStart)}
                            </div>

                        </div>
                        <article className="all-goals">
                            <div>{this.getTotal(team, currentWeek)}</div>
                            <hr />
                            <h3>Individual Goals</h3>
                            <div>{this.props.collection.map(this.getGoal.bind(this, team, currentWeek))}</div>
                        </article>

                    </div>
                </section>
            );
        }

    });



})(app.views);
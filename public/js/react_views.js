(function(views) {

var Input = React.createClass({displayName: "Input",
    render: function() {
        var htmlID = "textinput-" + name + Math.random();
        var type = this.props.type || "text";
        var label = this.props.label || this.props.name;
        var placeholder = this.props.placeholder || "";
        var value = this.props.value || "";
        var required = this.props.required || "";
        return (
            React.createElement("div", {className: "field"}, 
                React.createElement("label", {htmlFor: htmlID}, label), 
                React.createElement("input", {
                    type: type, 
                    name: this.props.name, 
                    htmlID: htmlID, 
                    placeholder: placeholder, 
                    defaultValue: value, 
                    required: required}
                )
            )
        );
    }

});

var Select = React.createClass({displayName: "Select",

    makeOption: function(option, index) {   
        var data = option;
        //console.log(option);
        var value = option["_id"] || option;

        if (option["name"]) {
            var concatName = option["name"] + " " +  
                             option["number"] + " " +
                             option["unit"] + " " +
                             option["amountOfTime"];
        }
        var name = concatName || option;
        //console.log(name, value);
        return React.createElement("option", {key: index, value: value}, name);

    },

    render: function() {
        var htmlID = "select-" + name + Math.random();
        var label = this.props.label || this.props.name;

        return (
            React.createElement("div", {className: "field field-select"}, 
                React.createElement("label", {htmlFor: htmlID}, label), 
                React.createElement("select", {htmlID: htmlID, 
                        defaultValue: this.props.defaultValue, 
                        name: this.props.name}, 
                    _.map(this.props.options, this.makeOption)
                )
                
            )
        );
    }

});


views.Input = Input;
views.Select = Select;


})(app.views);

(function(views){

    views.EntryForm = React.createBackboneClass({

        onSubmit: function(e) {
            e.preventDefault();
            var entryItems = $(e.target).serializeJSON();
            var states = _.map(entryItems, function(item) {
                return !!item;
            });
            var containsFalse = _.contains(states, false);
            if (!containsFalse) {
                app.trigger("create:entries:collection", entryItems);
            }
        },

        getInitialState: function() {
          return {
            start_date: null
          };
        },

        handleStartDateChange: function(date) {
            this.setState({
                start_date: date
            });
        },


        getGoalNames: function() {
            var collection = this.props.collection.toJSON();

            var userGoals = _.filter(collection, function(goal) {
                return app.currentUser.id === goal.user_id
            });
            return userGoals;

        },

        render: function() {
            return (

                React.createElement("form", {onSubmit: this.onSubmit, className: "form form-entry"}, 
                    React.createElement(views.Select, {label: "Goal", 
                        options: this.getGoalNames(), 
                        name: "goal_id"}), 
                    React.createElement(views.Input, {
                        label: "Number Completed", 
                        type: "number", 
                        name: "number", 
                        placeholder: "5", 
                        required: "required"}), 
                    React.createElement("label", null, "Date Completed"), 
                    React.createElement(DatePicker, {
                        selected: this.state.start_date, 
                        onChange: this.handleStartDateChange, 
                        placeholderText: "Click to select a date", 
                        maxDate: moment(), 
                        weekStart: "0"}), 
                    React.createElement("div", {className: "text-right"}, 
                        React.createElement("button", {className: "button button-primary"}, "Add Entry")
                    )
                )

            );
        }

    });

})(app.views);
(function(views){

    views.TwitterLogin = React.createBackboneClass({

        render: function() {
            return (
                React.createElement("button", {
                    className: "button button-secondary", 
                    onClick: app.twitterLogin.bind(app)}, "Sign In / Up"
                )  
            );     
        }

    });


    views.TwitterLogout = React.createBackboneClass({

        render: function() {
            return (
                React.createElement("button", {
                    className: "button button-secondary", 
                    onClick: app.logout.bind(app)}, "Sign Out"
                )  
            )
        }
    });


    views.LogInOut = React.createBackboneClass({

        getCorrectButton: function() {
            if (this.props.model.id) {
                return React.createElement(views.TwitterLogout, null);
            }
            else {
                return React.createElement(views.TwitterLogin, null)
            }
        },

        render: function() {
            return (
               React.createElement("div", {className: "log-in-out"}, this.getCorrectButton())
            )
        }
    });



})(app.views);
(function(views){

    views.GoalForm = React.createBackboneClass({

        units: ["miles", "minutes", "reps", "lbs", "times", "days"],
        time: ["per day", "per week", "per month", "in total"],

        onSubmit: function(e) {
            e.preventDefault();
            var goalItems = $(e.target).serializeJSON();
            var states = _.map(goalItems, function(item) {
                return !!item;
            });
            var containsFalse = _.contains(states, false);
            if (!containsFalse) {
                //app.trigger("add:goal", goalItems);   
                app.trigger("create:goals:collection", goalItems);
            }
        },

        render: function() {
            return (

                React.createElement("form", {onSubmit: this.onSubmit, className: "goal-form"}, 
                    React.createElement(views.Input, {
                        label: "Goal Name", 
                        type: "text", 
                        name: "name", 
                        placeholder: "ex: Run", 
                        required: "required"}), 
                    React.createElement(views.Input, {
                        label: "Number", 
                        type: "number", 
                        name: "number", 
                        placeholder: "5", 
                        required: "required"}), 
                    React.createElement(views.Select, {label: "Unit", 
                                options: this.units, 
                                name: "unit", 
                                defaultValue: "times"}), 
                    React.createElement(views.Select, {label: "Time Interval", 
                                options: this.time, 
                                name: "amountOfTime", 
                                defaultValue: "per week"}), 
                    React.createElement("div", {className: "text-right"}, React.createElement("button", {className: "button button-primary"}, "Add Goal"))
                    
                )

            );
        }

    });

})(app.views);
(function(views){

    views.CreateTeamForm = React.createClass({displayName: "CreateTeamForm",

        weeks: [8,9,10,11,12,13,14,15],

        onSubmit: function(e) {
            e.preventDefault();
            var teamOptions = $(e.target).serializeJSON();
            var states = _.map(teamOptions, function(item) {
                return !!item;
            });
            var containsFalse = _.contains(states, false);
            if (!containsFalse) {
                app.trigger("add:team", teamOptions);   
            }
        },

        render: function() {
            return (

                React.createElement("form", {onSubmit: this.onSubmit, className: "form create-team-form"}, 
                    React.createElement(views.Input, {
                        label: "Team Name", 
                        type: "text", 
                        name: "name", 
                        placeholder: "ex: Eat My Dust", 
                        required: "required"}), 
                    React.createElement(views.Input, {
                        label: "Bet per Person (in $)", 
                        type: "number", 
                        name: "number", 
                        placeholder: "ex: 25.00", 
                        required: "required"}), 
                    React.createElement(views.Select, {
                        label: "# of Weeks for Competition", 
                        options: this.weeks, 
                        name: "weeks", 
                        defaultValue: "12"}), 
                    React.createElement(views.Input, {
                        label: "Start Date (please enter as 'MM/DD/YYYY')", 
                        type: "text", 
                        name: "start_date", 
                        placeholder: "ex: 11/14/2015", 
                        required: "required"}), 
                    React.createElement("div", {className: "text-right"}, React.createElement("button", {className: "button button-primary"}, "Create Team"))
                )

            );
        }

    });



})(app.views);
(function(views){

    var Menu = React.createClass({displayName: "Menu",

        render: function() {
            return (
                React.createElement("div", {className: "main-menu"}, 
                    React.createElement("ul", null, 
                        React.createElement("li", {className: "first-to-last"}, 
                            React.createElement("a", {href: "#", className: "button"}, "+ Entry")
                        ), 
                        React.createElement("li", null, 
                            React.createElement("a", {href: "#"}, "Dashboard")
                        ), 
                        React.createElement("li", null, 
                            React.createElement("a", {href: "#", onClick: this.props.goToGoals}, "My Goals")
                        ), 
                        React.createElement("li", null, 
                            React.createElement("a", {href: "#"}, "My Profile")
                        )
                    )
                )
            )
        }

    });

    views.Header = React.createClass({displayName: "Header", 
        goToGoals: function() {
            app.trigger("fetch:goals:collection");
        },

        getInitialState: function() {
           return {
                activeMenu: ''
           };
         },

        setActiveMenu: function(e) {
            e.preventDefault();
            if (this.state.activeMenu !== "active") {
                this.setState({activeMenu: "active"});
            }
            else {
                this.setState({activeMenu: ""});
            }
        },

        render: function() {
                var menuClass = "menu-wrapper " + this.state.activeMenu;
            return (
                React.createElement("div", {className: "header-wrapper"}, 
                    React.createElement("div", {className: "header-bar"}, 
                        React.createElement("div", {className: "button button-menu", onClick: this.setActiveMenu}, "Menu"), 
                        React.createElement("h1", {className: "logo"}, "Final Project"), 
                        React.createElement("div", {className: "header-admin"}, 
                            React.createElement(views.LogInOut, {model: this.props.model})
                        )
                    ), 
                    React.createElement("div", {className: menuClass}, 
                        React.createElement(Menu, {goToGoals: this.goToGoals})
                    )
                )

            )
        }

    });

})(app.views);
(function(views){

    views.JoinTeam = React.createBackboneClass({
        selectTeam: function(model) {
            this.props.onTeamSelect(model);            
        },

        getTeam: function(model, index) {
            return (
                React.createElement("li", {key: index}, React.createElement("button", {className: "button", onClick: this.selectTeam.bind(this, model)}, model.get("name")))
            );
        },

        render: function() {
            return (
                React.createElement("div", null, 
                    React.createElement("h4", null, "Choose the team you'd like to join."), 
                    React.createElement("ul", {className: "list list-buttons"}, this.props.collection.map(this.getTeam))
                )
            );
        }

    });



})(app.views);
(function(views){

    views.LandingPage = React.createBackboneClass({

        render: function() {
            return (
                React.createElement("section", {className: "main"}, 
                    React.createElement("header", {className: "header-main"}, 
                        React.createElement("h2", null, "Name TBD")
                    ), 
                    React.createElement("article", null, 
                        React.createElement("h3", null, "Beat your friends"), 
                        React.createElement("h3", null, "Get in shape"), 
                        React.createElement("h3", null, "Win $$")
                    )
                ) 
            );
        }

    });



})(app.views);
(function(views){

    views.MainDash = React.createBackboneClass({

        render: function() {
            return (
                React.createElement("section", {className: "main"}, 
                    React.createElement("header", {className: "header-main"}, 
                        React.createElement("h2", null, this.props.getTeamName()), 
                        React.createElement("button", {
                            className: "button button-primary", 
                            onClick: this.props.addGoal}, "+ Goal"
                        ), 
                        React.createElement("button", {className: "button button-primary", 
                            onClick: this.props.addEntry}, "+ Entry"
                        )
                    ), 
                    React.createElement("div", {className: "results-toggle"}, 
                        React.createElement("button", {className: "button button-secondary"}, "To Date"), 
                        React.createElement("button", {className: "button"}, "Week 5")
                    ), 
                    React.createElement("article", {className: "all-goals"}, 
                        React.createElement("h3", null, "All Goals"), 
                        React.createElement("span", {className: "completion-rate completion-rate-lg"}, "45%"), 
                        React.createElement("div", {className: "progress-bar progress-bar-lg"}), 
                        React.createElement("hr", null), 
                        React.createElement("h4", null, "Run 15 mi per week"), 
                        React.createElement("span", {className: "completion-rate"}, "55%"), 
                        React.createElement("div", {className: "progress-bar"})
                    )
                )
            );
        }

    });



})(app.views);
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

        getPercentComplete: function(currentProgress, totalGoal) {
            var percentComplete = ((currentProgress / totalGoal) * 100).toFixed(1);
            return percentComplete + "%";
        },

        render: function() {
            var goal = this.props.model.toJSON();
            var entries = goal.entries;

            var totalGoal = goal.number * this.props.team.weeks;
            var currentProgress = this.getCurrentTotal(entries);

            var percentComplete = this.getPercentComplete(currentProgress, totalGoal);

            var goalName = goal.name + " " + 
                       goal.number + " " + 
                       goal.unit + " " + 
                       goal.amountOfTime;
            var progressStyle = {
                width: percentComplete 
            }
            return (
                React.createElement("div", {className: "goal-progress", key: this.props.key}, 
                    React.createElement("h4", null, goalName, " - ", percentComplete), 
                    React.createElement("div", {className: "progress-container"}, 
                        React.createElement("div", {className: "progress-bar", style: progressStyle})
                    ), 
                    React.createElement("span", null, currentProgress, " ", goal.unit, " out of ", totalGoal, " ")
                )
            );
        }

    });


var TotalProgress = React.createBackboneClass({

    getCurrentTotal: function(entries) {
        var entryNumbers = [];
        entryNumbers = _.flatten(entries);

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

        return _.reduce(goalNumbers, function(a, b) {
            return a + b;
        });

    },

    getPercentComplete: function(currentProgress, endAmount) {
        var percentComplete = ((currentProgress / endAmount) * 100).toFixed(1);
        return percentComplete + "%";
    },

    render: function() {
        var goals = this.props.collection.toJSON();

        var entries = goals.map(function(goal) {
            return goal.entries;
        });


        var currentProgress = this.getCurrentTotal(entries);

        var totalGoals = this.getTotal(goals);

        var totalWeeks = this.props.team.weeks;
        var endAmount = totalGoals * totalWeeks;

        var percentComplete = this.getPercentComplete(currentProgress, endAmount);

        var progressStyle = {
            width: percentComplete 
        }
        return (
            React.createElement("div", {className: "goal-progress"}, 
                React.createElement("h3", null, "Total Progress: ", percentComplete), 
                React.createElement("div", {className: "progress-container"}, 
                    React.createElement("div", {className: "progress-bar", style: progressStyle})
                )
            )
        );
    }

});

    views.MyDash = React.createBackboneClass({

        getGoal: function(team, model, index) {
            return React.createElement(SingleGoalProgress, {key: index, model: model, team: team});
        },

        getTotal: function(team) {
            return React.createElement(TotalProgress, {collection: this.props.collection, team: team})
        },

        getCurrentWeek: function() {

        },

        render: function() {
            var team = this.props.getTeam();
            team = team.toJSON();

            var start_date = moment(team.start_date);
            var now = moment();

            var daysFromStart = now.diff(start_date, 'days');

            var currentWeek = Math.ceil(daysFromStart / 7);



            return (
                React.createElement("section", {className: "main"}, 
                    React.createElement("header", {className: "header-main"}, 
                        React.createElement("h2", null, "My Goals"), 
                        React.createElement("button", {
                            className: "button button-primary", 
                            onClick: this.props.addGoal}, "+ Goal"
                        ), 
                        React.createElement("button", {className: "button button-primary", 
                            onClick: this.props.addEntry}, "+ Entry"
                        )
                    ), 
                    React.createElement("div", {className: "results-toggle"}, 
                        React.createElement("button", {className: "button button-secondary"}, "To Date"), 
                        React.createElement("button", {className: "button"}, "Week ", currentWeek)
                    ), 
                    React.createElement("article", {className: "all-goals"}, 
                        React.createElement("div", null, this.getTotal(team)), 
                        React.createElement("hr", null), 
                        React.createElement("h3", null, "Individual Goals"), 
                        React.createElement("div", null, this.props.collection.map(this.getGoal.bind(this, team)))
                    )
                )
            );
        }

    });



})(app.views);
(function(views){

    views.JoinOrCreateTeam = React.createBackboneClass({

        render: function() {
            return (
                React.createElement("div", null, 
                    React.createElement("h2", null, "Hi ", this.props.model.get("name"), "! ", React.createElement("br", null), "Welcome to the app!"), 
                    React.createElement("div", {className: "buttons-toggle"}, 
                        React.createElement("button", {className: "button button-primary", onClick: this.props.onJoinSelect}, "Join a Team"), 
                        React.createElement("button", {className: "button button-primary", onClick: this.props.onCreateNew}, "Create New Team ")
                    )
                )
  
            );
        }

    });



})(app.views);
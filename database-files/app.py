import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

##########################
# Database Set up 
##########################

# dialect+driver://username:password@host:port/database
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql+psycopg2://postgres:bankslovesfood@localhost:5432/projectNFL"
db = SQLAlchemy(app)

# Reflect database into a new model
Base = automap_base()

# Reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table (table name in db HomeAnalysis)
# Metatdata = Base.classes.year_metatdata (this is a separate table in the Bellybutton hw)
HomeAnalysis = Base.classes.homeanalysis

@app.route("/")
def index():
    # return the homepage
    # return render_template("index.html")
    return 'hello matt'


@app.route("/season")
def season():
    # return list of year names
    stmt = db.session.query(HomeAnalysis).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    return jsonify(list(df["season"]))

@app.route("/metadata/<season>")
def season_metadata(season): 
    # return MetaData for a given season CHECK ON THE TABLE NAMES
    sel = [
        HomeAnalysis.season,
        HomeAnalysis.homewin,
        HomeAnalysis.awaywin,
        HomeAnalysis.homescore,
        HomeAnalysis.awayscore
    ]

    results = db.session.query(*sel).filter(HomeAnalysis.season == season).all()

    # create a dictionary entry for each row of metatdata
    season_metadata= {}
    for result in results:
        season_metadata["season"] = result[0]
        season_metadata["homeWin"] = result[1]
        season_metadata["awayWin"] = result[2]
        season_metadata["homeScore"] = result[3]
        season_metadata["awayScore"] = result[4]

    print(season_metadata)
    return jsonify(season_metadata)


@app.route("/seasons-data")
def seasons_data():
    sel = [
    HomeAnalysis.season,
    HomeAnalysis.homewin,
    HomeAnalysis.awaywin,
    HomeAnalysis.homescore,
    HomeAnalysis.awayscore
    ]

    results = db.session.query(*sel).all()

    season_data = []

    for season, homewin, awaywin, homescore, awayscore in results:
        season_dict = {}
        season_dict["season"] = season
        season_dict["homeWin"] = homewin
        season_dict["awayWin"] = awaywin
        season_dict["homeScore"] = homescore
        season_dict["awayScore"] = awayscore
        season_data.append(season_dict)

    return jsonify(season_data)


# @app.route("/seasons/<season>")
# def seasons(season):
#     # return col values for chart
#     stmt = db.session.query(HomeAnalysis).statement
#     df = pd.read_sql_query(stmt, db.session.bind)

#     season_data = df.loc[df["season"] == season, ["homewin", "awaywin", "homescore", "awayscore"]]

#     # format data to send as JSON
#     data = {
#         "season" : season_data.season.values.tolist(),
#         "homeWin" : season_data.homewin.values.tolist(),
#         "awayWin" : season_data.awaywin.values.tolist(),
#         "homePoints" : season_data.homescore.values.tolist(),
#         "awayPoints" : season_data.awayscore.values.tolist()
#     }
#     return jsonify(data)

if __name__== "__main__":
    app.run()


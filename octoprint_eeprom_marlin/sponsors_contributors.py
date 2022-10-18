# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, unicode_literals

__license__ = "GNU Affero General Public License http://www.gnu.org/licenses/agpl.html"
__copyright__ = (
    "Copyright (C) 2020 Charlie Powell - Released under terms of the AGPLv3 License"
)

GITHUB_URL = "https://github.com/"


##############################################
# Adding users
# Name field can be either name, or username (with an @)
# if username is empty, then it will not be linked
##############################################

SPONSORS = [
    {"name": "@ssl-3", "username": "ssl-3"},
    {"name": "Gina Häußge", "username": "foosel"},
    {"name": "@FlynHokie", "username": "FlynHokie"},
    {"name": "Ken Lucke", "username": "KenLucke"},
    {"name": "Guyot François", "username": "iFrostizz"},
    {"name": "@pRINTERnOODLE", "username": "pRINTERnOODLE"},
    {"name": "@samwiseg0", "username": "samwiseg0"},
    {"name": "Nigel", "username": "nigelboubert"},
    {"name": "Matt Ockendon", "username": "mockendon"},
    {"name": "@otaku13", "username": "otaku13"},
    {"name": "@ReggieMDavis", "username": "ReggieMDavis"},
    {"name": "@erickstryck", "username": "erickstryck"},
]

CONTRIBUTORS = [
    {"name": "Anderson Silva (Previous maintainer)", "username": "amsbr"},
    {"name": "Dan Pasanen", "username": "invisiblek"},
    {"name": "@Desterly", "username": "Desterly"},
    {"name": "@gddeen", "username": "gddeen"},
]


def export_sponsors():
    return _export_urls(SPONSORS)


def export_contributors():
    return _export_urls(CONTRIBUTORS)


def _export_urls(data):
    """Adds github links"""
    exported = []
    for item in data:
        if item["username"]:
            url = GITHUB_URL + item["username"]
        else:
            url = ""

        exported.append({"name": item["name"], "url": url})
    return exported

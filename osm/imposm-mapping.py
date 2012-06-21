# -*- coding: utf-8 -*-

import re
from imposm.mapping import (
    Options,
    Points, LineStrings, Polygons, PolygonTable,
    String, Bool, Integer, OneOfInt,
    set_default_name_type, LocalizedName,
    WayZOrder, ZOrder, Direction,
    GeneralizedTable, UnionView,
    PseudoArea, meter_to_mapunit, sqr_meter_to_mapunit,
    DropElem
)

from imposm.db import postgis

import imposm.config
imposm.config.import_partial_relations = True
imposm.config.relation_builder = 'contains'

db_conf = Options(
    # db='osm',
    host='localhost',
    port=5432,
    user='osm',
    password='osm',
    sslmode='allow',
    prefix='osm_new_',
    proj='epsg:900913',
)

class Highway(LineStrings):
    fields = (
        ('highway', String()),
        ('layer', Integer()),
        ('z_order', WayZOrder()),
        ('access', String()),
        ('bicycle', String()),
        ('footway', String()),
    )
    field_filter = (
        ('area', Bool()),
        ('tunnel', Bool()),
        ('bridge', Bool()),
    )

pedestrian_and_bicycle = Highway(
    name = 'pedestrian_and_bicycle',
    mapping = {
        'highway': (
            'cycleway',
            'path',
            'pedestrian',
            'footway',
            'bridleway',
        ),
        'bicycle': (
            'yes',
            'designated'
        )
    }
)

cycle_route = Highway(
    name = 'cycle_route',
    mapping = {
        'cycleway': (
            'lane',
            'share_busway',
            'opposite_lane',
            'track',
            'opposite_track',
            'shared_lane',
            'opposite',
        )
    }
)

bicycle_and_car_preferred = Highway(
    name = 'bicycle_and_car_preferred',
    mapping = {
        'highway': (
            'living_street',
            'unclassified',
            'road',
            'residential',
            'residential_link',
            'tertiary',
            'tertiary_link'
        )
    }
)

bicycle_and_car_hazard = Highway(
    name = 'bicycle_and_car_hazard',
    mapping = {
        'highway': (
            'byway',
            'track',
            'service',
            'secondary',
            'secondary_link',
            'primary',
            'primary_link',
            'trunk_link',
            'motorway_link',
        )
    }
)

car_only = Highway(
    name = 'car_only',
    mapping = {
        'highway': (
            'trunk',
            'motorway',
        ),
    }
)

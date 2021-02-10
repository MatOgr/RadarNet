CREATE TABLE Organisations(
    organisation_id integer not null,
    organisation_name varchar2(100) not null,
    attribution clob,
    org_url varchar2(255),
    logo_url varchar2(255)
);
ALTER TABLE Organisations 
    ADD CONSTRAINT org_pk PRIMARY KEY (org_id);


CREATE TABLE Networks(
    network_id integer not null,
    network_name varchar2(100) not null,
    org_id integer not null
);
ALTER TABLE Networks 
    ADD CONSTRAINT net_pk PRIMARY KEY (network_id);
ALTER TABLE Networks 
    ADD CONSTRAINT net_org_fk FOREIGN KEY(org_id) 
        REFERENCES Organisations (organisation_id);


CREATE TABLE Radars(
    radar_id        INTEGER NOT NULL,
    radar_name      VARCHAR2(32) NOT NULL,
    lon             FLOAT NOT NULL,
    lat             FLOAT NOT NULL,
    elev_asl        INTEGER NOT NULL,
    is_dp           CHAR(1) NOT NULL,
    is_doppler      CHAR(1) NOT NULL,
    net_id          INTEGER NOT NULL
);
ALTER TABLE Radars 
    ADD CONSTRAINT radar_pk PRIMARY KEY(radar_id);
ALTER TABLE Radars 
    ADD CONSTRAINT radar_net_fk FOREIGN KEY(net_id)
        REFERENCES Networks (network_id);


CREATE TABLE Scans(
    scan_id         INTEGER NOT NULL,
    scan_range      INTEGER NOT NULL,
    lowprf          INTEGER NOT NULL,
    highprf         INTEGER NOT NULL,
    dbz_on          CHAR(1) NOT NULL,
    dbuz_on         CHAR(1) NOT NULL,
    v_on            CHAR(1) NOT NULL,
    w_on            CHAR(1) NOT NULL,
    rhohv_on        CHAR(1) NOT NULL,
    kdp_on          CHAR(1) NOT NULL,
    phidp_on        CHAR(1) NOT NULL,
    zdr_on          CHAR(1) NOT NULL,
    rad_id          INTEGER NOT NULL
);
ALTER TABLE Scans 
    ADD CONSTRAINT scan_pk PRIMARY KEY ( scan_id );
ALTER TABLE Scans
    ADD CONSTRAINT scan_radar_fk FOREIGN KEY ( rad_id )
        REFERENCES Radars ( radar_id );


CREATE TABLE Volumes (
    volume_id       INTEGER NOT NULL,
    dtype           VARCHAR2(10) NOT NULL,
    creation_date   DATE NOT NULL,
    radar_used_id          INTEGER NOT NULL,
    scan_used_id         INTEGER NOT NULL
);
ALTER TABLE Volumes 
    ADD CONSTRAINT volume_pk PRIMARY KEY ( volume_id );
ALTER TABLE Volumes
    ADD CONSTRAINT volume_radar_fk FOREIGN KEY ( radar_used_id )
        REFERENCES Radars ( radar_id );
ALTER TABLE Volumes
    ADD CONSTRAINT volume_scan_fk FOREIGN KEY ( scan_used_id )
        REFERENCES Scans ( scan_id ); 


CREATE TABLE Radar_users(
    user_id                 INTEGER NOT NULL,
    user_login              VARCHAR2(255) NOT NULL,
    user_password           VARCHAR2(255) NOT NULL,
    fname                   VARCHAR2(255) NOT NULL,
    sname                   VARCHAR2(255) NOT NULL,
    registration_date       DATE NOT NULL,
    api_key                 VARCHAR2(255),
    user_relation_id        INTEGER NOT NULL, 
    composite_relation_id   INTEGER NOT NULL
);
ALTER TABLE Radar_users ADD CONSTRAINT radar_users_pk PRIMARY KEY(user_id);


CREATE TABLE Products (
    product_id              INTEGER NOT NULL,
    product_type            VARCHAR2(16) NOT NULL,
    dtype                   VARCHAR2(8) NOT NULL,
    scan_used_id            INTEGER NOT NULL,
    radar_used_id           INTEGER NOT NULL,
    composite_used_id       INTEGER,
    hmin                    FLOAT,
    hmax                    FLOAT,
    zr_relation             VARCHAR2(100),
    height                  FLOAT,
    r_min                   FLOAT,
    r_max                   FLOAT,
    posangle                FLOAT
);

ALTER TABLE Products
    ADD CONSTRAINT ch_inh_product 
        CHECK ( hmin IN ( 3d, cappi, cmax, pcappi, ppi, vil ) );
ALTER TABLE Products 
    ADD CONSTRAINT product_pk PRIMARY KEY ( product_id );
ALTER TABLE Products
    ADD CONSTRAINT product_composite_fk FOREIGN KEY ( composite_used_id )
        REFERENCES Composites ( composite_id );
ALTER TABLE Products
    ADD CONSTRAINT product_radar_fk FOREIGN KEY ( radar_used_id )
        REFERENCES Radars ( radar_id );
ALTER TABLE Products
    ADD CONSTRAINT product_scan_fk FOREIGN KEY ( scan_used_id )
        REFERENCES Scans ( scan_id );


CREATE TABLE Composites (
    composite_id  INTEGER NOT NULL,
    merge_type    VARCHAR2(32) NOT NULL
);
ALTER TABLE Composites 
    ADD CONSTRAINT composite_pk PRIMARY KEY ( composite_id );


CREATE TABLE Scales (
    scale_id    INTEGER NOT NULL,
    scale_name  VARCHAR2(100) NOT NULL,
    vmin        FLOAT NOT NULL,
    vmax        FLOAT NOT NULL
);
ALTER TABLE Scales 
    ADD CONSTRAINT scale_pk PRIMARY KEY ( scale_id );


CREATE TABLE Scan_images (
    scan_image_id           INTEGER NOT NULL,
    scan_image_url          VARCHAR2(255) NOT NULL,
    resolution              INTEGER NOT NULL,
    scale_used_id           INTEGER NOT NULL,
    composite_made_id       INTEGER,
    product_made_id         INTEGER
);
ALTER TABLE Scan_images 
    ADD CONSTRAINT scan_image_pk PRIMARY KEY ( scan_image_id );
ALTER TABLE Scan_images
    ADD CONSTRAINT scan_image_composite_fk FOREIGN KEY ( composite_made_id )
        REFERENCES Composites ( composite_id );
ALTER TABLE Scan_images
    ADD CONSTRAINT scan_image_product_fk FOREIGN KEY ( product_made_id )
        REFERENCES Products ( product_id );
ALTER TABLE Scan_images
    ADD CONSTRAINT scan_image_scale_fk FOREIGN KEY ( scale_used_id )
        REFERENCES Scales ( scale_id );


CREATE TABLE relation_product_user (
    product_rel_id      INTEGER NOT NULL,
    user_rel_id         INTEGER NOT NULL
);
ALTER TABLE relation_product_user 
    ADD CONSTRAINT relation_p_u_pk PRIMARY KEY ( product_rel_id, user_rel_id );
ALTER TABLE relation_product_user
    ADD CONSTRAINT relation_p_u_product_fk FOREIGN KEY ( product_rel_id )
        REFERENCES Products ( product_id );
ALTER TABLE relation_product_user
    ADD CONSTRAINT relation_p_u_user_fk FOREIGN KEY ( user_rel_id )
        REFERENCES Radar_users ( user_id );


CREATE TABLE relation_composite_user (
    composite_rel_id    INTEGER NOT NULL,
    user_rel_id         INTEGER NOT NULL
);
ALTER TABLE relation_composite_user 
    ADD CONSTRAINT relation_c_u_pk PRIMARY KEY ( composite_rel_id, user_rel_id );
ALTER TABLE relation_composite_user
    ADD CONSTRAINT relation_c_u_composite_fk FOREIGN KEY ( composite_rel_id )
        REFERENCES Composites ( composite_id );
ALTER TABLE relation_composite_user
    ADD CONSTRAINT relation_c_u_user_fk FOREIGN KEY ( user_rel_id )
        REFERENCES Radar_users ( user_id );
SELECT *
FROM Images;

SELECT *
FROM Composites;

SELECT *
FROM Products;

SELECT *
FROM Scales;


INSERT INTO Organisations(organisation_id, organisation_name, attribution, org_url, logo_url)
    VALUES(666, 'Wantya kidney', 'incredible', 'gimmeKIDNEYS.com', 'beautyLOGO');
INSERT INTO Networks(network_id, network_name, org_id)
    VALUES(1, 'this_network', 666);
INSERT INTO Radars(radar_id, radar_name, lon, lat, elev_asl, is_dp, is_doppler, net_id)
    VALUES(1, 'this_name', 1.0, 2.0, 3, 'Y', 'N', 1);
INSERT INTO Scans(scan_id, scan_range, lowprf, highprf, dbz_on, dbuz_on, v_on, w_on, rhohv_on, kdp_on, phidp_on, zdr_on, rad_id)
    VALUES(1, 20, 1, 2, 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 1);
INSERT INTO Scales(scale_name,  vmin, vmax)
    VALUES('TestScale', 13.06, 1560.27) ;
INSERT INTO Composites(composite_id, merge_type)
    VALUES(1, 'that_type');
INSERT INTO Products(product_id, product_type, dtype, scan_used_id, radar_used_id, hmin, hmax)
    VALUES(1, '3D', 'dtype', 1, 1, 10.0, 321.1);
    
---     IMAGECHECK tests
INSERT INTO Images(image_id, image_url, resolution, scale_used_id, composite_made_id)
    VALUES(1, 'compoURL', 1234, 1, 1);
INSERT INTO Images(image_id, image_url, resolution, scale_used_id, product_made_id)
    VALUES(2, 'prodURL', 1234, 1, 1);
INSERT INTO Images(image_id, image_url, resolution, scale_used_id, composite_made_id, product_made_id)
    VALUES(3, 'compo_prodURL', 1234, 1, 1, 1);
INSERT INTO Images(image_id, image_url, resolution)
    VALUES(2, 'prodURL', 1234);
    
    
---     PRODUCTCHECK tests
INSERT INTO Products(product_id, product_type, dtype, scan_used_id, radar_used_id, hmin, hmax, zr_relation)
    VALUES(1, '3D', 'dtype', 1, 1, 10.0, 321.1, 'very well');
INSERT INTO Products(product_id, product_type, dtype, scan_used_id, radar_used_id, height, r_min, r_max)
    VALUES(2, 'PCAPPI', 'dtype', 1, 1, 120.0, 1.1, 51.2);
INSERT INTO Products(product_id, product_type, dtype, scan_used_id, radar_used_id, height, r_min, r_max)
    VALUES(3, 'CAPPI', 'dtype', 1, 1, 120.0, 1.1, 51.2);
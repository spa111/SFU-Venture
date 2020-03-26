CREATE TABLE users ( 
	id                   bigserial  NOT NULL ,
	fullname             text  NOT NULL ,
	password             text  NOT NULL ,
	email                text  NOT NULL ,
	username             text   ,
	is_email_verified    bool DEFAULT false  ,
	is_admin             bool DEFAULT false  ,
	is_student           bool DEFAULT false  ,
	is_faculty           bool DEFAULT false  ,
	is_faculty_verified  bool DEFAULT false  ,
	CONSTRAINT pk_users_id PRIMARY KEY ( id ),
	CONSTRAINT unique_email UNIQUE ( email ) ,
	CONSTRAINT unique_username UNIQUE ( username ) 
 );
 
 CREATE TABLE textbooks (
	id                bigserial  NOT NULL ,
	posting_user_id	  bigint NOT NULL ,
	txt_book_name     text  NOT NULL ,
	course_name       text  NOT NULL ,
	faculty_name      text  NOT NULL ,
	price             money DEFAULT 0 NOT NULL ,
	post_date         date NOT NULL DEFAULT current_timestamp,
	img_url           text  NOT NULL,
	description		  text ,
	CONSTRAINT pk_txtbook_id PRIMARY KEY ( id )
);

ALTER TABLE textbooks ADD CONSTRAINT fk_textbook_poster FOREIGN KEY ( posting_user_id ) REFERENCES users( id ) on DELETE CASCADE ON UPDATE CASCADE;

CREATE  TABLE marketplace ( 
	id                   bigserial  NOT NULL ,
	listing_user_id      bigint  NOT NULL ,
	listing_title        text  NOT NULL ,
	listing_description  text   ,
	listing_price        money DEFAULT 0 NOT NULL ,
	listing_contact_info text   ,
	CONSTRAINT pk_marketplace_listing_id PRIMARY KEY ( id )
 );

ALTER TABLE marketplace ADD CONSTRAINT fk_marketplace_listing_users FOREIGN KEY ( listing_user_id ) REFERENCES users( id ) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE  TABLE activities ( 
	id                   bigserial  NOT NULL ,
	poster_user_id       bigint  NOT NULL ,
	corresponding_department text  NOT NULL ,
	activity_title       text  NOT NULL ,
	activity_description text  NOT NULL ,
	activity_price     money DEFAULT 0 NOT NULL ,
	activity_location    text  NOT NULL ,
	activity_timestamp timestamp DEFAULT current_timestamp NOT NULL ,
	CONSTRAINT pk_activities_id PRIMARY KEY ( id )
 );

ALTER TABLE activities ADD CONSTRAINT fk_poster_user_id FOREIGN KEY ( poster_user_id ) REFERENCES users( id ) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE  TABLE volunteer_board ( 
	id                   bigserial  NOT NULL ,
	user_id              bigint  NOT NULL ,
	volunteer_title      text  NOT NULL ,
	volunteer_description text  NOT NULL ,
	volunteer_location   text  NOT NULL ,
	volunteer_timestamp  timestamp DEFAULT current_timestamp NOT NULL ,
	CONSTRAINT pk_volunteer_board_id PRIMARY KEY ( id )
 );

ALTER TABLE volunteer_board ADD CONSTRAINT fk_user_id FOREIGN KEY ( user_id ) REFERENCES users( id ) ON DELETE CASCADE ON UPDATE CASCADE;

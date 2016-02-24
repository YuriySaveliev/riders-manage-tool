drop table if exists riders;
create table riders(
    id integer primary key autoincrement,
    firstName text not null,
    lastName text not null,
    size text not null,
    brand text not null,
    riderClass text not null,
    numberRider integer not null
);
-- create a blogs table
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes integer DEFAULT 0
);

-- add some content to the table blogs
insert into blogs (author, url, title) values ('He-Man', 'https://en.wikipedia.org/wiki/He-Man', 'He-Man and the Masters of the Universe');

insert into blogs (author, url, title) values ('Dan Abramov', 'https://overreacted.io/on-let-vs-const', 'On let vs const');
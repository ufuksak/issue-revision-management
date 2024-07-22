CREATE TABLE issue_db.issues (
  id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  created_by VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_by VARCHAR(100),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE issue_db.revisions
(
    id          INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    state       VARCHAR(100) NOT NULL,
    title       VARCHAR(100) NOT NULL,
    description TEXT         NOT NULL,
    issue_id    INT(6),
    created_by  VARCHAR(100) NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT now(),
    updated_by  VARCHAR(100),
    updated_at  TIMESTAMP    NOT NULL DEFAULT now()
);

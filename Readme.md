## SQL statement to create table
```
create table todo
(
    id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tasks text NOT NULL,
    status boolean NOT NULL default 0,
    created_at date NOT NULL,
    deadline date NOT NULL
);
```






Task priority
Method 1:

```
select *,(deadline - current_date()) as priority from todo;
```

Method 2:
```

```
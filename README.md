# blog-api

## apis :

> POST `/login`

> POST `/signup`

### Post/[id]

> GET `/post/:id`
> <br><br>

Return:

```json
{
  "post": {
    "_id": "6555e0750fcf76bdc3cccXXX",
    "title": "Article TITILE",
    "content": "Article Content",
    "comments": [
      {
        "_id": "6555e610e56f34a22f104XXX",
        "content": "I am the comment!",
        "date": "2023-11-16T09:51:12.873Z",
        "author": {
          "_id": "655476abddf0aa26a2fe6ce3",
          "username": "commentUsername"
        },
        "__v": 0
      }
    ],
    "publication_date": "2023-11-16T09:27:17.523Z",
    "author": {
      "_id": "655476abddf0aa26a2fe6ce3",
      "username": "authorUsername"
    },
    "is_published": true,
    "__v": 0
  },
  "success": true
}
```

> POST `/post`

> PUT `/post/:id`

> DELETE `/post/:id`

> GET `/posts`

> POST `/post/:postid/comment`

> PUT `/post/:postid/comment/:commentid`

> DELETE `/post/:postid/comment/:commentid`

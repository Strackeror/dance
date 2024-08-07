# caret

```
(test { toast } test)
          | 0
```

## caret jump
[up](#caret)

- .seek.enclosingSurround

```
(test { toast } test)
               | 0
```

## caret jump-twice
[up](#caret)

- .seek.enclosingSurround { inner: true }
- .seek.enclosingSurround { inner: true }

```
(test { toast } test)
       | 0
```


## caret extend
[up](#caret)

- .seek.enclosingSurround { shift: "extend", inner: true }

```
(test { toast } test)
          ^^^| 0
```
## caret extend-twice
[up](#caret)

- .seek.enclosingSurround { shift: "extend", inner: true }
- .seek.enclosingSurround { shift: "extend", inner: true }

```
(test { toast } test)
       |^^ 0
```

# caret-anchor

```
(test { toast } test)
          |^^^^^^^ 0
```

## caret-anchor extend
[up](#caret-anchor)

- .seek.enclosingSurround { shift: "extend", inner: true }

```
(test { toast } test)
              |^^^ 0
```

## caret-anchor extend-twice
[up](#caret-anchor)

- .seek.enclosingSurround { shift: "extend", inner: true }
- .seek.enclosingSurround { shift: "extend", inner: true }

```
(test { toast } test)
       |^^^^^^^^^^ 0
```



# char

> behavior <- character

```
(test { toast } test)
          ^ 0
```

## char jump
[up](#char)

- .seek.enclosingSurround

```
(test { toast } test)
              ^ 0
```
## char jump-twice
[up](#char)

- .seek.enclosingSurround
- .seek.enclosingSurround

```
(test { toast } test)
      ^ 0
```

## char extend
[up](#char)

- .seek.enclosingSurround { shift: "extend" }

```
(test { toast } test)
          ^^^^^ 0
```

## char extend-twice
[up](#char)

- .seek.enclosingSurround { shift: "extend" }
- .seek.enclosingSurround { shift: "extend" }

```
(test { toast } test)
      |^^^^ 0
```


# char-anchor

> behavior <- character

```
(test { toast } test)
          |^^^^^^^ 0
```

## char-anchor extend
[up](#char-anchor)

- .seek.enclosingSurround { shift: "extend" }

```
(test { toast } test)
              |^^^ 0
```

## char-anchor extend-twice
[up](#char-anchor)

- .seek.enclosingSurround { shift: "extend" }
- .seek.enclosingSurround { shift: "extend" }

```
(test { toast } test)
      |^^^^^^^^^^^ 0
```

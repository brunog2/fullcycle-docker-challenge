FROM golang:alpine3.20 as build

WORKDIR /app

COPY src/hello.go .

RUN go build hello.go

FROM scratch

COPY --from=build /app/hello hello

ENTRYPOINT ["./hello"]



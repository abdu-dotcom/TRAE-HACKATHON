# Backend (Spring Boot)

## Run

```bash
mvnw.cmd -f backend/pom.xml spring-boot:run
```

```bash
mvn -f backend/pom.xml spring-boot:run
```

## Test Endpoint

```bash
curl -s http://localhost:8080/api/v1/health
```

Contoh response:

```json
{"status":"UP","service":"hackathon-backend","time":"2026-05-30T10:15:30Z"}
```


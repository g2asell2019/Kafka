# Setup
```bash
git clone github.com/g2asell2019/Kafka
cd Kafka
docker compose build
docker compose up
cd ./ConsumerKafka
docker build -t consumer_kafka:lastest .
docker run --name consumer_kafka --network=host --env-file .env consumer_kafka:lastest
```

## Limitation
- Must build the consumer Kafka container independently.

## API Documentation

#### Base URL
```
http://localhost:3000
```

#### Endpoints

##### Get Real-Time Stock Data
- **URL:** `/stocks/realtime`
- **Method:** `GET`
- **Description:** Fetches the latest real-time stock data.
- **Response:**
    ```json
    [
        {
            "_id": "66d087d5d4c164c44b8d27da",
            "ticker": "BTH",
            "date": "2024-08-29",
            "open": 39,
            "close": 39,
            "high": 39,
            "low": 39,
            "volume": 100
        }
    ]
    ```

##### Get Historical Stock Data
- **URL:** `/stocks/history`
- **Method:** `GET`
- **Description:** Fetches historical stock data within a specified date range.
- **Query Parameters:**
    - `startDate` (required): Start date in `YYYY-MM-DD` format.
    - `endDate` (required): End date in `YYYY-MM-DD` format.
    - `ticker` (optional): Stock ticker symbol.
- **Response:**
    ```json
    [
        {
            "_id": "66d087d5d4c164c44b8d27da",
            "ticker": "BTH",
            "date": "2024-08-29",
            "open": 39,
            "close": 39,
            "high": 39,
            "low": 39,
            "volume": 100
        }
    ]
    ```

##### Create New Stock Data
- **URL:** `/stocks`
- **Method:** `POST`
- **Description:** Creates a new stock data entry.
- **Request Body:**
    ```json
    {
        "ticker": "BTH",
        "date": "2024-08-29",
        "open": 39,
        "close": 39,
        "high": 39,
        "low": 39,
        "volume": 100
    }
    ```
- **Response:**
    ```json
    {
        "acknowledged": true,
        "insertedId": "string"
    }
    ```

##### Update Stock Data
- **URL:** `/stocks/:id`
- **Method:** `PUT`
- **Description:** Updates an existing stock data entry by ID.
- **Request Parameters:**
    - `id` (required): The ID of the stock data to update.
- **Request Body:**
    ```json
    {
        "ticker": "BTH",
        "date": "2024-08-29",
        "open": 39,
        "close": 39,
        "high": 39,
        "low": 39,
        "volume": 100
    }
    ```
- **Response:**
    ```json
    {
        "acknowledged": true,
        "modifiedCount": "number",
        "upsertedId": "string",
        "upsertedCount": "number",
        "matchedCount": "number"
    }
    ```

##### Delete Stock Data
- **URL:** `/stocks/:id`
- **Method:** `DELETE`
- **Description:** Deletes a stock data entry by ID.
- **Request Parameters:**
    - `id` (required): The ID of the stock data to delete.
- **Response:**
    ```json
    {
        "acknowledged": true,
        "deletedCount": "number"
    }
    ```

#### WebSocket

##### Real-Time Stock Data Broadcast
- **URL:** `ws://localhost:3000`
- **Description:** Connect to the WebSocket server to receive real-time stock data updates.
- **Headers:**
    - `x-account` (required): Must be `StockTraders` to authorize the connection.
- **Messages:**
    - **Receive:** Real-time stock data in JSON format.
    - **Send:** Request historical stock data.
        ```json
        {
            "startDate": "YYYY-MM-DD",
            "endDate": "YYYY-MM-DD",
            "ticker": "string"
        }
        ```
    - **Response:**
        ```json
        [
            {
                "_id": "string",
                "ticker": "string",
                "price": "number",
                "date": "string"
            }
        ]
        ```


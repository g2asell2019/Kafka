# Setup


## Zookeeper
```bash
docker run -p 2181:2181 zookeeper
```

## Kafka
```bash
docker run -p 9092:9092 -e KAFKA_ZOOKEEPER_CONNECT=127.0.0.1:2181 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.1.13:9092 -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 confluentinc/cp-kafka
```

# Kafka

https://gist.github.com/piyushgarg-dev/32cadf6420c452b66a9a6d977ade0b01
https://github.com/confluentinc/cp-docker-images/wiki/Getting-Started

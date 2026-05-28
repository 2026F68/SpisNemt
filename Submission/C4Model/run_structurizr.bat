@echo off
REM Run Structurizr Lite with Docker

docker run -it --rm -p 8080:8080 -v "%cd%:/usr/local/structurizr" structurizr/lite

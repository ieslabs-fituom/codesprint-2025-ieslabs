from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    workday_host: str          # e.g. wd2-impl-services1.workday.com
    tenant: str                # your Workday tenant identifier
    client_id: str             # OAuth2 client ID
    client_secret: str         # OAuth2 client secret

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# Instantiate settings once for import elsewhere
settings = Settings()
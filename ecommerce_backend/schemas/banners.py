from pydantic import BaseModel


class Create_Banner(BaseModel):
    title: str
    sub_title: str
    CTA: str
    image_url: str
    target_url: str

class BannerResponse(BaseModel):
    banner_id: int
    title: str
    sub_title: str
    CTA: str
    image_url: str
    target_url: str

    class Config:
        from_attributes = True



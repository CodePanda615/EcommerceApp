from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    DateTime
)
from sqlalchemy.sql import func

from utils.connection import Base


class Banner(Base):

    __tablename__ = "banners"

    banner_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String,
        nullable=False
    )

    sub_title = Column(
        String,
        nullable=False
    )

    CTA = Column(
        String(50),
        default="SHOP NOW",
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
        
    )
    
    target_url=Column(
      String,
      nullable= True
    )
    
    image_url=Column(
      String,
      nullable= False
    )
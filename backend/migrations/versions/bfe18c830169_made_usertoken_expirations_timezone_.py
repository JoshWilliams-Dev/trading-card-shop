"""Made UserToken expirations timezone aware.

Revision ID: bfe18c830169
Revises: dd61ee4913cb
Create Date: 2024-10-06 06:48:14.678749

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'bfe18c830169'
down_revision = 'dd61ee4913cb'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('UserTokens', schema=None) as batch_op:
        batch_op.alter_column('access_token_expires',
               existing_type=postgresql.TIMESTAMP(),
               type_=sa.DateTime(timezone=True),
               existing_nullable=False)
        batch_op.alter_column('refresh_token_expires',
               existing_type=postgresql.TIMESTAMP(),
               type_=sa.DateTime(timezone=True),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('UserTokens', schema=None) as batch_op:
        batch_op.alter_column('refresh_token_expires',
               existing_type=sa.DateTime(timezone=True),
               type_=postgresql.TIMESTAMP(),
               existing_nullable=False)
        batch_op.alter_column('access_token_expires',
               existing_type=sa.DateTime(timezone=True),
               type_=postgresql.TIMESTAMP(),
               existing_nullable=False)

    # ### end Alembic commands ###

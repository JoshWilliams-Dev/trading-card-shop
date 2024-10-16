"""Added a file name column to the Cards table.

Revision ID: ecf5e99682bf
Revises: 1fe8512ee1db
Create Date: 2024-10-06 20:12:03.960737

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ecf5e99682bf'
down_revision = '1fe8512ee1db'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('Cards', schema=None) as batch_op:
        batch_op.add_column(sa.Column('image_filepath', sa.String(length=120), nullable=False))
        batch_op.alter_column('image_filename',
               existing_type=sa.VARCHAR(length=120),
               type_=sa.String(length=50),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('Cards', schema=None) as batch_op:
        batch_op.alter_column('image_filename',
               existing_type=sa.String(length=50),
               type_=sa.VARCHAR(length=120),
               existing_nullable=False)
        batch_op.drop_column('image_filepath')

    # ### end Alembic commands ###

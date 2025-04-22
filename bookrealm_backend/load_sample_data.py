import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookrealm.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import Book, UserProfile, Favorite, Review

# Sample book data
books_data = [
    {
        'title': 'To Kill a Mockingbird',
        'author': 'Harper Lee',
        'description': 'The story of young Jean Louise Finch and the trial of Tom Robinson in a racially divided Alabama town.',
        'cover_image': 'https://source.unsplash.com/random/350x500/?book,classic',
        'publisher': 'J.B. Lippincott & Co.',
        'year': 1960,
        'isbn': '9780061120084',
        'featured': True
    },
    {
        'title': '1984',
        'author': 'George Orwell',
        'description': 'A dystopian novel set in a totalitarian regime where Big Brother is always watching.',
        'cover_image': 'https://source.unsplash.com/random/350x500/?book,dystopian',
        'publisher': 'Secker & Warburg',
        'year': 1949,
        'isbn': '9780451524935',
        'featured': True
    },
    {
        'title': 'Pride and Prejudice',
        'author': 'Jane Austen',
        'description': 'The story follows the main character, Elizabeth Bennet, as she deals with issues of manners, upbringing, morality, education, and marriage.',
        'cover_image': 'https://source.unsplash.com/random/350x500/?book,romance',
        'publisher': 'T. Egerton, Whitehall',
        'year': 1813,
        'isbn': '9780141439518',
        'featured': False
    },
    {
        'title': 'The Great Gatsby',
        'author': 'F. Scott Fitzgerald',
        'description': 'Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway\'s interactions with mysterious millionaire Jay Gatsby.',
        'cover_image': 'https://source.unsplash.com/random/350x500/?book,gatsby',
        'publisher': 'Charles Scribner\'s Sons',
        'year': 1925,
        'isbn': '9780743273565',
        'featured': True
    },
    {
        'title': 'Moby-Dick',
        'author': 'Herman Melville',
        'description': 'The saga of Captain Ahab and his monomaniacal pursuit of the white whale.',
        'cover_image': 'https://source.unsplash.com/random/350x500/?book,whale',
        'publisher': 'Harper & Brothers',
        'year': 1851,
        'isbn': '9780142437247',
        'featured': False
    },
    {
        'title': 'The Catcher in the Rye',
        'author': 'J.D. Salinger',
        'description': 'The story of Holden Caulfield, a teenage boy who has been expelled from prep school and is navigating his way through New York City.',
        'cover_image': 'https://source.unsplash.com/random/350x500/?book,teen',
        'publisher': 'Little, Brown and Company',
        'year': 1951,
        'isbn': '9780316769488',
        'featured': False
    },
    {
        'title': 'The Lord of the Rings',
        'author': 'J.R.R. Tolkien',
        'description': 'An epic high-fantasy novel set in Middle-earth, a fictional world filled with magic and peril.',
        'cover_image': 'https://source.unsplash.com/random/350x500/?book,fantasy',
        'publisher': 'George Allen & Unwin',
        'year': 1954,
        'isbn': '9780618640157',
        'featured': True
    },
    {
        'title': 'Harry Potter and the Philosopher\'s Stone',
        'author': 'J.K. Rowling',
        'description': 'The first novel in the Harry Potter series, following the life of a young wizard, Harry Potter, and his friends.',
        'cover_image': 'https://source.unsplash.com/random/350x500/?book,magic',
        'publisher': 'Bloomsbury',
        'year': 1997,
        'isbn': '9780747532699',
        'featured': True
    },
]


# Create sample users
def create_sample_users():
    if not User.objects.filter(username='admin').exists():
        admin = User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        UserProfile.objects.create(user=admin, bio='Site Administrator')

    if not User.objects.filter(username='user1').exists():
        user1 = User.objects.create_user('user1', 'user1@example.com', 'user123')
        UserProfile.objects.create(user=user1, bio='Book enthusiast and avid reader')

    if not User.objects.filter(username='user2').exists():
        user2 = User.objects.create_user('user2', 'user2@example.com', 'user123')
        UserProfile.objects.create(user=user2, bio='Literature professor with a passion for classics')


# Create sample books
def create_sample_books():
    for book_data in books_data:
        if not Book.objects.filter(isbn=book_data['isbn']).exists():
            Book.objects.create(**book_data)


# Create sample favorites
def create_sample_favorites():
    user1 = User.objects.get(username='user1')
    user2 = User.objects.get(username='user2')

    # User1 favorites
    for book in Book.objects.filter(featured=True):
        Favorite.objects.get_or_create(user=user1, book=book)

    # User2 favorites
    for book in Book.objects.filter(year__lt=1900):
        Favorite.objects.get_or_create(user=user2, book=book)


# Create sample reviews
def create_sample_reviews():
    user1 = User.objects.get(username='user1')
    user2 = User.objects.get(username='user2')

    Review.objects.get_or_create(
        user=user1,
        book=Book.objects.get(title='The Lord of the Rings'),
        defaults={
            'text': 'An epic masterpiece that defined the fantasy genre. The world-building is unmatched.',
            'rating': 5
        }
    )

    Review.objects.get_or_create(
        user=user1,
        book=Book.objects.get(title='Harry Potter and the Philosopher\'s Stone'),
        defaults={
            'text': 'The book that started it all. A magical journey that appeals to all ages.',
            'rating': 5
        }
    )

    Review.objects.get_or_create(
        user=user2,
        book=Book.objects.get(title='Pride and Prejudice'),
        defaults={
            'text': 'A timeless classic that explores social dynamics with wit and charm.',
            'rating': 5
        }
    )

    Review.objects.get_or_create(
        user=user2,
        book=Book.objects.get(title='1984'),
        defaults={
            'text': 'Orwell\'s vision of a dystopian future remains as relevant as ever.',
            'rating': 4
        }
    )


def main():
    print("Creating sample data...")
    create_sample_users()
    create_sample_books()
    create_sample_favorites()
    create_sample_reviews()
    print("Sample data created successfully!")


if __name__ == "__main__":
    main()

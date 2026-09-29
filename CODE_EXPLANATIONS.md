# Code Explanations

*This document explains the "why" behind the code without cluttering the Python files with heavy comments.*

## `app/models/user.py`
*   **`__tablename__ = "users"`**: Tells PostgreSQL exactly what to name the table in the database.
*   **`primary_key=True, index=True`**: `primary_key` makes this the unique identifier for a row. `index=True` makes searching the database for this ID much faster.
*   **`google_id`**: Stores the unique ID Google gives us upon login. `nullable=False` means a user *must* have this.
*   **`total_points = Column(Integer, default=0)`**: New users automatically start with 0 points for our gamification system.
*   **`server_default=func.now()`**: Automatically stamps the row with the exact time the user was saved to the database.

## `app/models/expense.py`
*   **`ForeignKey("users.id")`**: This is the crucial link! It tells the database that this specific expense belongs to a specific user ID in the `users` table. This is how we avoid the "table per user" problem.
*   **`expense_date = Column(Date)`**: Stores the actual date the expense occurred (e.g., Nov 5th), which might be different from `created_at` (when they typed it into the app).
*   **`user = relationship(...)`**: This is an SQLAlchemy helper. It allows us to easily get the User object if we have an Expense object (e.g., `my_expense.user.email`). `backref="expenses"` means we can also type `my_user.expenses` to get a list of all their expenses automatically.

## `app/schemas/user.py`
*   **`EmailStr`**: A special Pydantic type. It automatically checks if the string provided is a valid email format (e.g., contains an @ symbol). If not, it blocks the request before hitting the database.
*   **`class UserCreate(UserBase)`**: Inheritance! When creating a user, we need their `google_id`. We inherit the email and name from `UserBase` so we don't have to re-type them.
*   **`class UserResponse`**: This is the data we safely send *back* to the frontend. Notice it doesn't include `google_id`? We keep that secret strictly on the backend.
*   **`from_attributes = True`**: This tells Pydantic that it's allowed to read data directly from our SQLAlchemy database objects.

## `app/schemas/expense.py`
*   **`Field(..., gt=0)`**: This adds an extra strict rule to the bouncer. `gt=0` means the amount must be Greater Than 0. A user cannot enter a negative or zero expense.
*   **`min_length=1`**: Ensures the user doesn't submit a blank string for a category.

## `app/crud/user.py` & `app/crud/expense.py` (The Kitchen Helpers)
*   **`db: Session`**: You'll see this in every function. This is the "fridge door being held open". We pass the active database connection to the function so it can do its work.
*   **`.filter(...)`**: This is how we search. `User.google_id == google_id` tells PostgreSQL to find the exact row matching the Google ID.
*   **`.first()` vs `.all()`**: `.first()` stops searching after it finds one match (good for unique IDs like emails). `.all()` gets everything (good for fetching a whole month of expenses).
*   **`db.add()`, `db.commit()`, `db.refresh()`**: This is the 3-step process to save new data. 
    1. `add()` places it in the fridge temporarily. 
    2. `commit()` firmly saves it permanently to PostgreSQL. 
    3. `refresh()` looks at what was just saved and updates our Python object with the brand new Database ID and `created_at` timestamp.
*   **`**expense.model_dump()`**: A neat Python trick. Instead of manually typing `amount=expense.amount, category=expense.category...`, `model_dump()` takes the Pydantic schema and unpacks it perfectly into the SQLAlchemy model all at once.
*   **`extract('year', ...)`**: A powerful SQLAlchemy tool that reaches inside the Date column in PostgreSQL and pulls out just the year or month so we can filter history easily.

## `app/api/auth.py` (The Login Waiter)
*   **`httpx.AsyncClient()`**: Instead of dealing with messy redirects, our backend simply asks Google directly: "Hey, is the token the frontend sent me valid?" This makes the React frontend much easier to build later.
*   **`request.session['user_id'] = user.id`**: This is where we place the "tracker on the table". From now on, any request from this user's browser will automatically have `user_id` inside the cookie.

## `app/api/expenses.py` (The Expense Waiter)
*   **`user_id: int = Depends(get_current_user_id)`**: This is brilliant. Before the Waiter even looks at the expense data, it runs this function. If the user doesn't have a valid session cookie, it instantly kicks them out with a `401 Not Logged In` error. No password checks needed on every single request!

## `app/main.py` (The Restaurant Manager Updated)
*   **`SessionMiddleware`**: This is the engine that actually allows our "Table Tracker" (Session Cookies) to work securely using our `SECRET_KEY`.
*   **`app.include_router(...)`**: We tell the FastAPI Manager about our new Waiters, so it knows who to send requests to when someone visits `/auth/login` or `/expenses/`.
<!-- ## `app/api/auth.py` (The Login Waiter)
*   **`httpx.AsyncClient()`**: Instead of dealing with messy redirects, our backend simply asks Google directly: "Hey, is the token the frontend sent me valid?" This makes the React frontend much easier to build later.
*   **`request.session['user_id'] = user.id`**: This is where we place the "tracker on the table". From now on, any request from this user's browser will automatically have `user_id` inside the cookie.

## `app/api/expenses.py` (The Expense Waiter)
*   **`user_id: int = Depends(get_current_user_id)`**: This is brilliant. Before the Waiter even looks at the expense data, it runs this function. If the user doesn't have a valid session cookie, it instantly kicks them out with a `401 Not Logged In` error. No password checks needed on every single request!

## `app/main.py` (The Restaurant Manager Updated)
*   **`SessionMiddleware`**: This is the engine that actually allows our "Table Tracker" (Session Cookies) to work securely using our `SECRET_KEY`.
*   **`app.include_router(...)`**: We tell the FastAPI Manager about our new Waiters, so it knows who to send requests to when someone visits `/auth/login` or `/expenses/`. -->

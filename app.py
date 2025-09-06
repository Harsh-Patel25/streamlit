import streamlit as st
import pandas as pd
from datetime import datetime, date
import json

# Configure page
st.set_page_config(
    page_title="Todo List App",
    page_icon="✅", 
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize session state
if 'tasks' not in st.session_state:
    st.session_state.tasks = []
if 'task_counter' not in st.session_state:
    st.session_state.task_counter = 1

def add_task(title, description, category, priority, due_date):
    """Add a new task to the list"""
    task = {
        'id': st.session_state.task_counter,
        'title': title,
        'description': description,
        'category': category,
        'priority': priority,
        'due_date': due_date.strftime('%Y-%m-%d') if due_date else None,
        'completed': False,
        'created_at': datetime.now().strftime('%Y-%m-%d %H:%M'),
        'completed_at': None
    }
    st.session_state.tasks.append(task)
    st.session_state.task_counter += 1

def complete_task(task_id):
    """Mark a task as completed"""
    for task in st.session_state.tasks:
        if task['id'] == task_id:
            task['completed'] = True
            task['completed_at'] = datetime.now().strftime('%Y-%m-%d %H:%M')
            break

def uncomplete_task(task_id):
    """Mark a task as incomplete"""
    for task in st.session_state.tasks:
        if task['id'] == task_id:
            task['completed'] = False
            task['completed_at'] = None
            break

def delete_task(task_id):
    """Delete a task from the list"""
    st.session_state.tasks = [task for task in st.session_state.tasks if task['id'] != task_id]

def get_tasks_by_status(completed=False):
    """Get tasks filtered by completion status"""
    return [task for task in st.session_state.tasks if task['completed'] == completed]

def get_tasks_by_category(category):
    """Get tasks filtered by category"""
    if category == "All":
        return st.session_state.tasks
    return [task for task in st.session_state.tasks if task['category'] == category]

def main():
    st.title("✅ Todo List App")
    st.markdown("*Stay organized and get things done on any device*")
    
    # Sidebar for adding new tasks and filters
    with st.sidebar:
        st.header("➕ Add New Task")
        
        with st.form("add_task_form"):
            task_title = st.text_input("Task Title*", placeholder="Enter task title...")
            task_description = st.text_area("Description", placeholder="Optional details...")
            
            col1, col2 = st.columns(2)
            with col1:
                task_category = st.selectbox(
                    "Category",
                    ["Personal", "Work", "Shopping", "Health", "Learning", "Other"]
                )
            with col2:
                task_priority = st.selectbox(
                    "Priority",
                    ["Low", "Medium", "High", "Urgent"]
                )
            
            task_due_date = st.date_input(
                "Due Date (Optional)",
                value=None,
                min_value=date.today()
            )
            
            submitted = st.form_submit_button("Add Task", use_container_width=True)
            
            if submitted:
                if task_title.strip():
                    add_task(
                        task_title.strip(),
                        task_description.strip(),
                        task_category,
                        task_priority,
                        task_due_date
                    )
                    st.success("✅ Task added successfully!")
                    st.rerun()
                else:
                    st.error("❌ Please enter a task title")
        
        # Filters and stats
        st.divider()
        st.header("🔍 Filters & Stats")
        
        # Task statistics
        total_tasks = len(st.session_state.tasks)
        completed_tasks = len(get_tasks_by_status(completed=True))
        pending_tasks = len(get_tasks_by_status(completed=False))
        
        col1, col2 = st.columns(2)
        with col1:
            st.metric("Total Tasks", total_tasks)
            st.metric("Completed", completed_tasks)
        with col2:
            st.metric("Pending", pending_tasks)
            if total_tasks > 0:
                completion_rate = round((completed_tasks / total_tasks) * 100, 1)
                st.metric("Completion Rate", f"{completion_rate}%")
        
        # Category filter
        categories = ["All"] + list(set([task['category'] for task in st.session_state.tasks]))
        selected_category = st.selectbox("Filter by Category", categories)
        
        # View mode
        view_mode = st.radio(
            "View Mode",
            ["All Tasks", "Pending Only", "Completed Only"]
        )
        
        # Clear completed tasks
        if completed_tasks > 0:
            if st.button("🗑️ Clear Completed Tasks", use_container_width=True):
                st.session_state.tasks = get_tasks_by_status(completed=False)
                st.success("Completed tasks cleared!")
                st.rerun()

    # Main content area
    if st.session_state.tasks:
        # Filter tasks based on selection
        if view_mode == "Pending Only":
            filtered_tasks = get_tasks_by_status(completed=False)
        elif view_mode == "Completed Only":
            filtered_tasks = get_tasks_by_status(completed=True)
        else:
            filtered_tasks = st.session_state.tasks
        
        # Apply category filter
        filtered_tasks = [task for task in filtered_tasks if selected_category == "All" or task['category'] == selected_category]
        
        if not filtered_tasks:
            st.info("📝 No tasks match your current filters.")
        else:
            # Sort tasks by priority and due date
            priority_order = {"Urgent": 4, "High": 3, "Medium": 2, "Low": 1}
            filtered_tasks.sort(key=lambda x: (
                x['completed'],  # Incomplete tasks first
                -priority_order.get(x['priority'], 0),  # Higher priority first
                x['due_date'] if x['due_date'] else '9999-12-31'  # Earlier due dates first
            ))
            
            st.subheader(f"📋 Tasks ({len(filtered_tasks)})")
            
            # Display tasks
            for i, task in enumerate(filtered_tasks):
                with st.container():
                    # Task card styling
                    card_style = "background-color: #f0f2f6; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;"
                    if task['completed']:
                        card_style = "background-color: #d4edda; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; opacity: 0.7;"
                    
                    # Priority color coding
                    priority_colors = {
                        "Urgent": "🔴",
                        "High": "🟠", 
                        "Medium": "🟡",
                        "Low": "🟢"
                    }
                    
                    # Task header
                    col1, col2, col3, col4 = st.columns([3, 1, 1, 1])
                    
                    with col1:
                        if task['completed']:
                            st.markdown(f"~~**{task['title']}**~~ ✅")
                        else:
                            st.markdown(f"**{task['title']}**")
                        
                        if task['description']:
                            st.markdown(f"*{task['description']}*")
                    
                    with col2:
                        st.markdown(f"{priority_colors.get(task['priority'], '⚪')} {task['priority']}")
                        st.markdown(f"📁 {task['category']}")
                    
                    with col3:
                        if task['due_date']:
                            due_date_obj = datetime.strptime(task['due_date'], '%Y-%m-%d').date()
                            days_left = (due_date_obj - date.today()).days
                            
                            if days_left < 0:
                                st.markdown(f"🔴 Overdue ({abs(days_left)} days)")
                            elif days_left == 0:
                                st.markdown("⚠️ Due Today")
                            elif days_left <= 3:
                                st.markdown(f"🟡 {days_left} days left")
                            else:
                                st.markdown(f"📅 {task['due_date']}")
                        else:
                            st.markdown("📅 No due date")
                        
                        st.markdown(f"🕐 {task['created_at']}")
                    
                    with col4:
                        # Action buttons
                        if not task['completed']:
                            if st.button("✅ Complete", key=f"complete_{task['id']}", use_container_width=True):
                                complete_task(task['id'])
                                st.success("Task completed!")
                                st.rerun()
                        else:
                            if st.button("↩️ Undo", key=f"undo_{task['id']}", use_container_width=True):
                                uncomplete_task(task['id'])
                                st.success("Task marked as pending!")
                                st.rerun()
                        
                        if st.button("🗑️ Delete", key=f"delete_{task['id']}", use_container_width=True):
                            delete_task(task['id'])
                            st.success("Task deleted!")
                            st.rerun()
                    
                    # Add visual separator
                    st.markdown("---")
    
    else:
        # Welcome screen for new users
        st.markdown("""
        ## 👋 Welcome to Your Todo List!
        
        This mobile-friendly app helps you stay organized and productive wherever you are.
        
        ### 🚀 Getting Started:
        1. **Add a task** using the sidebar form
        2. **Set priorities** to focus on what matters most
        3. **Organize by categories** to keep things tidy
        4. **Mark tasks complete** when you're done
        
        ### 📱 Mobile Optimized Features:
        - Touch-friendly interface
        - Quick actions and gestures
        - Responsive design for any screen size
        - Fast performance on mobile networks
        
        ### ✨ Productivity Features:
        - Priority levels (Low, Medium, High, Urgent)
        - Categories for organization
        - Due date tracking with alerts
        - Completion statistics
        - Filter and sort options
        
        **Start by adding your first task in the sidebar!** →
        """)
        
        # Quick start examples
        st.divider()
        st.subheader("📝 Quick Start Examples")
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            if st.button("🛒 Add Shopping Task", use_container_width=True):
                add_task("Buy groceries", "Milk, bread, fruits", "Shopping", "Medium", None)
                st.success("✅ Shopping task added!")
                st.rerun()
        
        with col2:
            if st.button("💼 Add Work Task", use_container_width=True):
                add_task("Finish project report", "Complete the quarterly analysis", "Work", "High", date.today())
                st.success("✅ Work task added!")
                st.rerun()
        
        with col3:
            if st.button("🏃 Add Health Task", use_container_width=True):
                add_task("Morning workout", "30 minutes cardio exercise", "Health", "Medium", None)
                st.success("✅ Health task added!")
                st.rerun()

    # Export functionality
    if st.session_state.tasks:
        st.divider()
        st.subheader("📤 Export Tasks")
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Export as JSON
            tasks_json = json.dumps(st.session_state.tasks, indent=2)
            st.download_button(
                label="📋 Download as JSON",
                data=tasks_json,
                file_name=f"todo_list_{datetime.now().strftime('%Y%m%d_%H%M')}.json",
                mime="application/json",
                use_container_width=True
            )
        
        with col2:
            # Export as CSV
            if st.session_state.tasks:
                tasks_df = pd.DataFrame(st.session_state.tasks)
                csv = tasks_df.to_csv(index=False)
                st.download_button(
                    label="📊 Download as CSV",
                    data=csv,
                    file_name=f"todo_list_{datetime.now().strftime('%Y%m%d_%H%M')}.csv",
                    mime="text/csv",
                    use_container_width=True
                )

if __name__ == "__main__":
    main()

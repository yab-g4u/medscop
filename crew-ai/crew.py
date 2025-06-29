import yaml
from tools.public_health_tool import PublicHealthTool
from tools.funding_insight_tool import FundingInsightTool
from tools.sentiment_monitor import SentimentMonitor

class Agent:
    def __init__(self, config):
        self.id = config['id']
        self.role = config['role']
        self.goal = config['goal']
        self.tools = config['tools']
        self.task_history = []

    def execute_task(self, task_id, task_description):
        print(f"[{self.role}] Executing task: {task_description}")
        self.task_history.append(task_id)
        if "public_health_tool" in self.tools:
            PublicHealthTool().run()
        if "funding_insight_tool" in self.tools:
            FundingInsightTool().run()
        if "sentiment_monitor" in self.tools:
            SentimentMonitor().run()

def run_crew():
    with open("crew-ai/agents.yaml", "r") as file:
        agents_config = yaml.safe_load(file)['agents']
    with open("crew-ai/tasks.yaml", "r") as file:
        tasks_config = yaml.safe_load(file)['tasks']

    agents = {agent["id"]: Agent(agent) for agent in agents_config}

    for task in tasks_config:
        agent_id = task["agent"]
        agent = agents[agent_id]
        dependencies = task.get("depends_on", [])
        if all(dep in agent.task_history for dep in dependencies):
            agent.execute_task(task["id"], task["description"])

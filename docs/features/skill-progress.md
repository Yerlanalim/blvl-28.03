# Skill Progress System

## Overview
This document describes the skill progress system, which calculates, tracks, and visualizes user progress across six core business skill areas, providing personalized recommendations for skill improvement.

## Components

### 1. Skill Service
- Calculates skill progress based on completed levels
- Provides skill definitions with display names and descriptions
- Identifies dominant skills and areas for improvement
- Generates recommendations for skill development

### 2. Progress Service Integration
- Updates skill progress when levels are completed
- Stores progress in user profile data
- Calculates combined progress from multiple levels

### 3. SkillProgressSection
- Visual representation of skill progress
- Displays progress bars with percentage completion
- Shows skill descriptions and categories
- Uses color coding for different skill types

### 4. SkillRecommendations
- Suggests levels for improving weaker skills
- Analyzes current progress to identify skill gaps
- Provides direct links to recommended content
- Prioritizes recommendations by skill need

## Skill Categories

### Personal Skills (Личные навыки и развитие)
- Self-organization, time management, emotional intelligence
- Personal development and growth
- Work-life balance and stress management

### Management (Управление и планирование)
- Strategy and planning
- Team and project management
- Decision-making and leadership

### Networking (Нетворкинг и связи)
- Business connections and relationships
- Communication skills
- Networking strategies

### Client Work (Работа с клиентами и продажи)
- Client acquisition and retention
- Sales strategies
- Customer service and management

### Finance (Финансовое управление)
- Budgeting and financial planning
- Financial analysis and reporting
- Cash flow management

### Legal (Бухгалтерские и юр-е вопросы)
- Legal foundations for business
- Tax regulations and compliance
- Documentation and record-keeping

## Calculation Logic

### Progress Calculation
- Each completed level contributes points to associated skills
- Standard increment: 10 points per level per skill
- Maximum skill level: 100 points (capped)
- Calculation is performed whenever a level is completed

### Recommendations Algorithm
1. Identify skills with lowest progress values
2. Find uncompleted levels that focus on those skills
3. Sort by level order for logical progression
4. Present top recommendations for each skill area

## Implementation Details
- React components for visualization
- Service-based calculation logic separate from UI
- Integration with progress tracking system
- Data persistence in user progress record 
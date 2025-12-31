require 'sinatra'
require 'json'
require_relative 'database'

set :port, 4567
set :bind, '0.0.0.0'

before do
  content_type :json
end

# 1. Health Check
get '/health' do
  { status: 'ok', system: 'Strategy Management System' }.to_json
end

# 2. List Strategy Versions
get '/strategies' do
  sql = "SELECT id, name, status, valid_from, valid_to FROM strategy_versions ORDER BY created_at DESC"
  result = DB.query(sql)
  result.map { |row| row }.to_json
end

# 3. Get Full Strategy Canvas (Hierarchy)
get '/strategies/:id/canvas' do
  strategy_id = params[:id]

  # Fetch Themes
  themes_sql = "SELECT id, title, description, weighting FROM strategic_themes WHERE strategy_version_id = $1"
  themes = DB.query(themes_sql, [strategy_id]).map { |row| row }

  # Enrich themes with Objectives
  themes.each do |theme|
    objs_sql = "SELECT id, title, statement, metric_type FROM objectives WHERE theme_id = $1"
    theme['objectives'] = DB.query(objs_sql, [theme['id']]).map { |row| row }
  end

  { strategy_id: strategy_id, canvas: themes }.to_json
end

# 4. Impact Analysis (Graph Traversal)
get '/assumptions/:id/impact' do
  assumption_id = params[:id]
  
  sql = <<~SQL
    SELECT 
      aim.entity_type,
      aim.entity_id,
      aim.impact_severity,
      CASE 
        WHEN aim.entity_type = 'initiative' THEN (SELECT title FROM initiatives WHERE id = aim.entity_id)
        WHEN aim.entity_type = 'theme' THEN (SELECT title FROM strategic_themes WHERE id = aim.entity_id)
      END as entity_name
    FROM assumption_impact_map aim
    WHERE aim.assumption_id = $1
  SQL

  impacts = DB.query(sql, [assumption_id]).map { |row| row }
  { assumption_id: assumption_id, impacts: impacts }.to_json
end

# --- WRITE ENDPOINTS (WIZARD SUPPORT) ---

# 5. Create New Strategy
post '/strategies' do
  data = JSON.parse(request.body.read)
  sql = "INSERT INTO strategy_versions (name, status, created_by) VALUES ($1, 'draft', $2) RETURNING id"
  # Hardcoding created_by UUID for demo purposes
  res = DB.query(sql, [data['name'], '00000000-0000-0000-0000-000000000001'])
  { id: res[0]['id'], status: 'created' }.to_json
end

# 6. Add Theme to Strategy
post '/strategies/:id/themes' do
  data = JSON.parse(request.body.read)
  sql = "INSERT INTO strategic_themes (strategy_version_id, title, description, owner_id) VALUES ($1, $2, $3, $4) RETURNING id"
  res = DB.query(sql, [params[:id], data['title'], data['description'], '00000000-0000-0000-0000-000000000001'])
  { id: res[0]['id'] }.to_json
end

# 7. Add Objective to Theme
post '/themes/:id/objectives' do
  data = JSON.parse(request.body.read)
  sql = "INSERT INTO objectives (theme_id, title, statement, metric_type, owner_id) VALUES ($1, $2, $3, $4, $5) RETURNING id"
  res = DB.query(sql, [params[:id], data['title'], data['statement'], 'financial', '00000000-0000-0000-0000-000000000001'])
  { id: res[0]['id'] }.to_json
end

# --- DRILL DOWN SUPPORT ---

# 8. Full Deep Dive (Theme -> Objective -> Initiative)
get '/strategies/:id/deep_dive' do
  strategy_id = params[:id]
  
  # Fetch Themes with Objectives and Initiatives
  # This is a simplified fetch; in production, use a more optimized query or ORM
  themes_sql = "SELECT id, title, description, health_status FROM strategic_themes WHERE strategy_version_id = $1"
  themes = DB.query(themes_sql, [strategy_id]).map { |row| row }

  themes.each do |theme|
    objs_sql = "SELECT id, title, statement, metric_type FROM objectives WHERE theme_id = $1"
    theme['objectives'] = DB.query(objs_sql, [theme['id']]).map do |obj|
      # Fetch Initiatives for this objective
      init_sql = <<~SQL
        SELECT i.id, i.title, i.status, i.budget_allocated 
        FROM initiatives i
        JOIN initiative_objectives_map iom ON iom.initiative_id = i.id
        WHERE iom.objective_id = $1
      SQL
      obj['initiatives'] = DB.query(init_sql, [obj['id']]).map { |r| r }
      obj
    end
  end

  { strategy_id: strategy_id, tree: themes }.to_json
end

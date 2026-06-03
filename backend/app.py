import os
import logging
from flask import Flask, jsonify, render_template_string
from flask_cors import CORS

from config import Config
from database.mongodb import db
from routes.upload import upload_bp
from routes.dashboard import dashboard_bp
from routes.reviews import reviews_bp
from routes.reports import reports_bp

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def create_app():
    """
    Application factory to set up and configure the Flask app.
    """
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(Config)
    
    # Enable Cross-Origin Resource Sharing (CORS)
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Initialize MongoDB client
    db.init_app(app)
    
    # Register Route Blueprints
    app.register_blueprint(upload_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(reviews_bp)
    app.register_blueprint(reports_bp)
    
    # Health Check Endpoint
    @app.route("/health", methods=["GET"])
    def health_check():
        try:
            # Check DB status by pinging admin command
            db.client.admin.command('ping')
            db_status = "connected"
        except Exception as e:
            logger.error(f"Health check failed database ping: {e}")
            db_status = f"error: {str(e)}"
            
        return jsonify({
            "status": "healthy",
            "database": db_status,
            "timestamp": db.reviews_collection.database.client.server_info().get('localTime') or ""
        }), 200

    # API Documentation (Swagger UI) Endpoint
    @app.route("/docs", methods=["GET"])
    def swagger_docs():
        return render_template_string("""
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>AI Review Intelligence API Docs</title>
          <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
          <style>
            html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
            *, *:before, *:after { box-sizing: inherit; }
            body { margin:0; background: #fafafa; }
            .swagger-ui .topbar { display: none; }
          </style>
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
          <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"></script>
          <script>
            window.onload = function() {
              const ui = SwaggerUIBundle({
                url: "/static/swagger.json",
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                  SwaggerUIBundle.presets.apis,
                  SwaggerUIStandalonePreset
                ],
                plugins: [
                  SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout"
              });
              window.ui = ui;
            };
          </script>
        </body>
        </html>
        """)

    # Global Error Handling Middleware
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"success": False, "error": error.description or "Bad request"}), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"success": False, "error": "Endpoint not found"}), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({"success": False, "error": "HTTP method not allowed"}), 405

    @app.errorhandler(500)
    def internal_server_error(error):
        logger.error(f"Internal server error: {error}", exc_info=True)
        return jsonify({"success": False, "error": "Internal server error occurred"}), 500

    @app.errorhandler(Exception)
    def handle_exception(e):
        logger.error(f"Unhandled exception: {e}", exc_info=True)
        return jsonify({"success": False, "error": "An unexpected error occurred"}), 500

    return app

# Expose app instance for WSGI/Render gunicorn deployments
app = create_app()

if __name__ == "__main__":
    # Start local Flask development server
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=app.config.get("DEBUG"))

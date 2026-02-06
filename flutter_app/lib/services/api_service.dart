import 'dart:convert';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

import '../models/reading_model.dart';

String get _baseUrl => dotenv.env['API_BASE_URL'] ?? 'http://localhost:3000';

class ApiService {
  static const Duration _timeout = Duration(seconds: 10);
  static const int _okStatus = 200;

  Future<ReadingModel> fetchLatestReading() async {
    final uri = Uri.parse('$_baseUrl/readings');
    final response = await http.get(uri).timeout(_timeout);

    if (response.statusCode != _okStatus) {
      throw Exception(
        'Failed to fetch latest reading (${response.statusCode}): ${response.body}',
      );
    }

    final decoded = _decodeJson(response.body);

    if (decoded is List && decoded.isNotEmpty) {
      return ReadingModel.fromJson(decoded.first as Map<String, dynamic>);
    }

    if (decoded is Map<String, dynamic>) {
      return ReadingModel.fromJson(decoded);
    }

    throw Exception(
      'Invalid response format: expected object or non-empty list',
    );
  }

  static dynamic _decodeJson(String body) {
    try {
      return json.decode(body);
    } on FormatException catch (e) {
      throw Exception('Invalid JSON from API: $e');
    }
  }
}

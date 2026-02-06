class ReadingModel {
  final int? id;
  final String sensor;
  final double value;
  final DateTime? createdAt;

  ReadingModel({
    this.id,
    required this.sensor,
    required this.value,
    this.createdAt,
  });

  factory ReadingModel.fromJson(Map<String, dynamic> json) {
    return ReadingModel(
      id: json['id'] is int
          ? json['id']
          : (json['id'] != null ? int.parse(json['id'].toString()) : null),
      sensor: json['sensor'] ?? 'unknown',
      value: (json['value'] is num)
          ? (json['value'] as num).toDouble()
          : double.parse(json['value'].toString()),
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : (json['timestamp'] != null
                ? DateTime.parse(json['timestamp'])
                : null),
    );
  }
}
